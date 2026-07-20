using backend.DTOs;
using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Services
{
    public class OrderService
    {
        private readonly IOrderRepository _orderRepo;
        private readonly ICartRepository _cartRepo;
        private readonly IUserRepository _userRepo;
        private readonly IProductRepository _productRepo;
        private readonly IPromoCodeRepository _promoRepo;

        public OrderService(IOrderRepository orderRepo, ICartRepository cartRepo,
                            IUserRepository userRepo, IProductRepository productRepo,
                            IPromoCodeRepository promoRepo)
        {
            _orderRepo = orderRepo;
            _cartRepo = cartRepo;
            _userRepo = userRepo;
            _productRepo = productRepo;
            _promoRepo = promoRepo;
        }

        public async Task<Order> CreateOrderAsync(int userId, CreateOrderDto dto)
        {
            var cart = await _cartRepo.GetCartByUserIdAsync(userId);
            if (cart == null || !cart.CartItems.Any())
                throw new Exception("Cart is empty");

            var user = await _userRepo.GetUserWithDetailsAsync(userId);
            var address = user.Addresses.FirstOrDefault(a => a.Id == dto.ShippingAddressId);
            if (address == null) throw new Exception("Address not found");

            decimal subTotal = cart.CartItems.Sum(ci => ci.PriceAtAdd * ci.Quantity);
            decimal shippingCost = 50; // ثابت أو حسب الموقع
            decimal taxAmount = subTotal * 0.14m; // 14% VAT
            decimal discountAmount = 0;

            // تطبيق كود الخصم إن وجد
            if (dto.PromoCodeId.HasValue)
            {
                var promo = await _promoRepo.GetByIdAsync(dto.PromoCodeId.Value);
                if (promo != null && promo.IsActive && promo.StartDate <= DateTime.UtcNow && promo.EndDate >= DateTime.UtcNow)
                {
                    if (promo.DiscountType == "Percentage")
                        discountAmount = subTotal * (promo.DiscountValue / 100);
                    else
                        discountAmount = promo.DiscountValue;
                    if (discountAmount > subTotal) discountAmount = subTotal;
                    promo.UsedCount++;
                    await _promoRepo.UpdateAsync(promo);
                }
            }

            var order = new Order
            {
                OrderNumber = GenerateOrderNumber(),
                UserId = userId,
                SubTotal = subTotal,
                ShippingCost = shippingCost,
                TaxAmount = taxAmount,
                DiscountAmount = discountAmount,
                TotalAmount = subTotal + shippingCost + taxAmount - discountAmount,
                Status = "Pending",
                PaymentMethod = dto.PaymentMethod,
                PaymentStatus = "Pending",
                ShippingAddressId = dto.ShippingAddressId,
                OrderDate = DateTime.UtcNow,
                Notes = dto.Notes,
                PromoCodeId = dto.PromoCodeId,
                OrderItems = cart.CartItems.Select(ci => new OrderItem
                {
                    ProductId = ci.ProductId,
                    Quantity = ci.Quantity,
                    UnitPrice = ci.PriceAtAdd,
                    TotalPrice = ci.PriceAtAdd * ci.Quantity
                }).ToList()
            };

            await _orderRepo.AddAsync(order);

            // تقليل الكمية من المخزون
            foreach (var item in cart.CartItems)
            {
                var product = await _productRepo.GetByIdAsync(item.ProductId);
                if (product != null)
                {
                    product.StockQuantity -= item.Quantity;
                    await _productRepo.UpdateAsync(product);
                }
            }

            // تفريغ السلة
            cart.CartItems.Clear();
            await _cartRepo.UpdateAsync(cart);

            return order;
        }

        public async Task<Order?> GetOrderByIdAsync(int orderId, int userId, bool isAdmin = false)
        {
            var order = await _orderRepo.GetOrderWithDetailsAsync(orderId);
            if (order == null) return null;
            if (!isAdmin && order.UserId != userId) return null;
            return order;
        }

        public async Task<IEnumerable<Order>> GetUserOrdersAsync(int userId)
            => await _orderRepo.GetOrdersByUserIdAsync(userId);

        public async Task<bool> CancelOrderAsync(int orderId, int userId)
        {
            var order = await _orderRepo.GetByIdAsync(orderId);
            if (order == null || order.UserId != userId) return false;
            if (order.Status != "Pending") return false;
            order.Status = "Cancelled";
            await _orderRepo.UpdateAsync(order);
            return true;
        }

        public async Task<bool> UpdateOrderStatusAsync(int orderId, string status, string? trackingNumber = null)
        {
            var order = await _orderRepo.GetByIdAsync(orderId);
            if (order == null) return false;
            order.Status = status;
            if (!string.IsNullOrEmpty(trackingNumber))
                order.TrackingNumber = trackingNumber;
            if (status == "Shipped") order.ShippedDate = DateTime.UtcNow;
            if (status == "Delivered") order.DeliveredDate = DateTime.UtcNow;
            await _orderRepo.UpdateAsync(order);
            return true;
        }

        private string GenerateOrderNumber()
            => $"ORD-{DateTime.UtcNow:yyyyMMdd}-{new Random().Next(1000, 9999)}";






        // Guest checkout — no logged-in user, no saved address, no server-side cart.
        // We create a stub User row so we don't have to relax the Order.UserId FK,
        // then build the address + order from the inline DTO. The new account can
        // later be claimed via "forgot password" since the email is theirs.
        public async Task<Order> CreateGuestOrderAsync(DTOs.GuestCheckoutDto dto)
        {
            if (dto.Items == null || !dto.Items.Any())
                throw new Exception("Cart is empty");

            // 1) Find an existing user with this email, or create a guest one.
            var existing = (await _userRepo.FindAsync(u => u.Email == dto.Email)).FirstOrDefault();
            User user;
            if (existing != null)
            {
                user = existing;
            }
            else
            {
                user = new User
                {
                    FullName = dto.FullName,
                    Email = dto.Email,
                    PhoneNumber = dto.PhoneNumber,
                    // Random unusable password — the guest can later set one via
                    // "forgot password" to claim the account.
                    PasswordHash = Convert.ToBase64String(
                        System.Security.Cryptography.RandomNumberGenerator.GetBytes(32)),
                    RoleId = 1, // Customer
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true,
                    IsEmailConfirmed = false
                };
                await _userRepo.AddAsync(user);
            }

            // 2) Save the shipping address against that user.
            var address = new Address
            {
                UserId = user.Id,
                Street = dto.Street,
                City = dto.City,
                State = dto.State ?? string.Empty,
                ZipCode = dto.ZipCode ?? string.Empty,
                Country = dto.Country,
                IsDefault = false
            };
            // The Address goes through EF tracked under user.Addresses — we add it
            // via the user-repo update path because there's no IAddressRepository
            // injected here. Simplest: load the user with details and append.
            var trackedUser = await _userRepo.GetUserWithDetailsAsync(user.Id);
            trackedUser!.Addresses.Add(address);
            await _userRepo.UpdateAsync(trackedUser);

            // 3) Build the order items from the cart payload, pulling current prices
            // and validating stock.
            var orderItems = new List<OrderItem>();
            decimal subTotal = 0;
            foreach (var item in dto.Items)
            {
                var product = await _productRepo.GetByIdAsync(item.ProductId);
                if (product == null)
                    throw new Exception($"Product {item.ProductId} not found");
                if (!product.IsActive)
                    throw new Exception($"Product '{product.Name}' is no longer available");
                if (product.StockQuantity < item.Quantity)
                    throw new Exception($"Not enough stock for '{product.Name}'");

                // Use discount price when set, else the regular price.
                decimal unitPrice = (product.DiscountPrice.HasValue && product.DiscountPrice > 0)
                    ? product.DiscountPrice.Value
                    : product.Price;

                orderItems.Add(new OrderItem
                {
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    UnitPrice = unitPrice,
                    TotalPrice = unitPrice * item.Quantity
                });
                subTotal += unitPrice * item.Quantity;
            }

            decimal shippingCost = 50;
            decimal taxAmount = subTotal * 0.14m;

            var order = new Order
            {
                OrderNumber = GenerateOrderNumber(),
                UserId = user.Id,
                SubTotal = subTotal,
                ShippingCost = shippingCost,
                TaxAmount = taxAmount,
                DiscountAmount = 0,
                TotalAmount = subTotal + shippingCost + taxAmount,
                Status = "Pending",
                PaymentMethod = dto.PaymentMethod,
                PaymentStatus = "Pending",
                ShippingAddressId = address.Id,
                OrderDate = DateTime.UtcNow,
                Notes = dto.Notes,
                OrderItems = orderItems
            };
            await _orderRepo.AddAsync(order);

            // 4) Decrement stock for every product in the order.
            foreach (var item in dto.Items)
            {
                var product = await _productRepo.GetByIdAsync(item.ProductId);
                if (product != null)
                {
                    product.StockQuantity -= item.Quantity;
                    await _productRepo.UpdateAsync(product);
                }
            }

            return order;
        }
    }




}