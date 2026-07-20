using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Services
{
    public class CartService
    {
        private readonly ICartRepository _cartRepo;
        private readonly IProductRepository _productRepo;

        public CartService(ICartRepository cartRepo, IProductRepository productRepo)
        {
            _cartRepo = cartRepo;
            _productRepo = productRepo;
        }

        public async Task<Cart?> GetCartByUserIdAsync(int userId)
            => await _cartRepo.GetCartByUserIdAsync(userId);

        public async Task<Cart> AddItemToCartAsync(int userId, int productId, int quantity)
        {
            var cart = await _cartRepo.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                cart = new Cart { UserId = userId, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow, CartItems = new List<CartItem>() };
                await _cartRepo.AddAsync(cart);
            }

            var product = await _productRepo.GetByIdAsync(productId);
            if (product == null) throw new Exception("Product not found");

            var existingItem = cart.CartItems.FirstOrDefault(i => i.ProductId == productId);
            if (existingItem != null)
            {
                existingItem.Quantity += quantity;
                existingItem.PriceAtAdd = product.DiscountPrice ?? product.Price;
            }
            else
            {
                cart.CartItems.Add(new CartItem
                {
                    ProductId = productId,
                    Quantity = quantity,
                    PriceAtAdd = product.DiscountPrice ?? product.Price,
                    AddedAt = DateTime.UtcNow
                });
            }

            cart.UpdatedAt = DateTime.UtcNow;
            await _cartRepo.UpdateAsync(cart);
            return cart;
        }

        public async Task<Cart> UpdateCartItemQuantityAsync(int userId, int cartItemId, int quantity)
        {
            var cart = await _cartRepo.GetCartByUserIdAsync(userId);
            var item = cart?.CartItems.FirstOrDefault(i => i.Id == cartItemId);
            if (item == null) throw new Exception("Item not found");

            if (quantity <= 0)
                cart.CartItems.Remove(item);
            else
                item.Quantity = quantity;

            cart.UpdatedAt = DateTime.UtcNow;
            await _cartRepo.UpdateAsync(cart);
            return cart;
        }

        public async Task<Cart> RemoveCartItemAsync(int userId, int cartItemId)
            => await UpdateCartItemQuantityAsync(userId, cartItemId, 0);

        public async Task ClearCartAsync(int userId)
        {
            var cart = await _cartRepo.GetCartByUserIdAsync(userId);
            if (cart != null)
            {
                cart.CartItems.Clear();
                cart.UpdatedAt = DateTime.UtcNow;
                await _cartRepo.UpdateAsync(cart);
            }
        }
    }
}