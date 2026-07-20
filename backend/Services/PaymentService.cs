using backend.DTOs;
using backend.Repositories.Interfaces;
using Stripe;

namespace backend.Services
{
    public class PaymentService
    {
        private readonly IOrderRepository _orderRepo;
        private readonly IUserRepository _userRepo;

        public PaymentService(IOrderRepository orderRepo, IUserRepository userRepo)
        {
            _orderRepo = orderRepo;
            _userRepo = userRepo;
            // في البيئة الحقيقية، ضع المفتاح في appsettings.json
            StripeConfiguration.ApiKey = "sk_test_your_stripe_secret_key";
        }

        public async Task<PaymentResponseDto> ProcessPaymentAsync(PaymentRequestDto dto)
        {
            var order = await _orderRepo.GetByIdAsync(dto.OrderId);
            if (order == null)
                return new PaymentResponseDto { Success = false, Message = "Order not found" };

            if (dto.PaymentMethod == "COD")
            {
                order.PaymentStatus = "Pending";
                await _orderRepo.UpdateAsync(order);
                return new PaymentResponseDto { Success = true, Message = "Order placed with Cash on Delivery" };
            }
            else if (dto.PaymentMethod == "Wallet")
            {
                var user = await _userRepo.GetByIdAsync(order.UserId);
                if (user.WalletBalance < order.TotalAmount)
                    return new PaymentResponseDto { Success = false, Message = "Insufficient wallet balance" };
                user.WalletBalance -= order.TotalAmount;
                await _userRepo.UpdateAsync(user);
                order.PaymentStatus = "Paid";
                await _orderRepo.UpdateAsync(order);
                return new PaymentResponseDto { Success = true, Message = "Payment successful from wallet" };
            }
            else if (dto.PaymentMethod == "CreditCard" && !string.IsNullOrEmpty(dto.StripeToken))
            {
                try
                {
                    var options = new PaymentIntentCreateOptions
                    {
                        Amount = (long)(order.TotalAmount * 100), // convert to cents
                        Currency = "usd",
                        PaymentMethod = dto.StripeToken,
                        ConfirmationMethod = "manual",
                        Confirm = true,
                        ReturnUrl = "http://localhost:4200/payment/complete"
                    };
                    var service = new PaymentIntentService();
                    var intent = await service.CreateAsync(options);

                    order.PaymentStatus = "Paid";
                    await _orderRepo.UpdateAsync(order);
                    return new PaymentResponseDto
                    {
                        Success = true,
                        Message = "Payment successful",
                        TransactionId = intent.Id,
                        PaymentIntentId = intent.ClientSecret
                    };
                }
                catch (StripeException ex)
                {
                    return new PaymentResponseDto { Success = false, Message = ex.Message };
                }
            }
            return new PaymentResponseDto { Success = false, Message = "Invalid payment method" };
        }
    }
}