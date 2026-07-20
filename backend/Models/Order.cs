using backend.Models;
using System.Net;

public class Order
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } // ORD-20250506-001
    public int UserId { get; set; }
    public decimal SubTotal { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } // Pending, Processing, Shipped, Delivered, Cancelled
    public string PaymentMethod { get; set; } // CreditCard, PayPal, COD, Wallet
    public string PaymentStatus { get; set; } // Pending, Paid, Failed, Refunded
    public int ShippingAddressId { get; set; }
    public DateTime OrderDate { get; set; }
    public DateTime? ShippedDate { get; set; }
    public DateTime? DeliveredDate { get; set; }
    public string? TrackingNumber { get; set; }
    public string? Notes { get; set; }
    public int? PromoCodeId { get; set; }

    // Navigation Properties
    public User User { get; set; }
    public Address ShippingAddress { get; set; }
    public PromoCode? PromoCode { get; set; }
    public Payment Payment { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; }
}