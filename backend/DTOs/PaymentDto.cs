namespace backend.DTOs
{
    public class PaymentRequestDto
    {
        public int OrderId { get; set; }
        public string PaymentMethod { get; set; }
        public string? StripeToken { get; set; } // for credit card
    }

    public class PaymentResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string? TransactionId { get; set; }
        public string? PaymentIntentId { get; set; }
    }
}