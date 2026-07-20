public class Payment
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public string PaymentMethod { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } // Pending, Success, Failed
    public string? TransactionId { get; set; } // من الـ Payment Gateway
    public DateTime? PaymentDate { get; set; }
    public string? FailureReason { get; set; }

    public Order Order { get; set; }
}