namespace backend.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentStatus { get; set; }
        public List<OrderItemDto> Items { get; set; }
        public AddressDto ShippingAddress { get; set; }
    }

    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public string? ProductImage { get; set; }
    }

    public class CreateOrderDto
    {
        public int ShippingAddressId { get; set; }
        public string PaymentMethod { get; set; } // CreditCard, PayPal, COD, Wallet
        public int? PromoCodeId { get; set; }
        public string? Notes { get; set; }
    }

    public class UpdateOrderStatusDto
    {
        public string Status { get; set; } // Admin only
        public string? TrackingNumber { get; set; }
    }
    // Used by POST /api/Orders/guest — lets a non-authenticated visitor place an
    // order without registering. Behind the scenes the backend creates a real
    // User row (with a random password) so all existing FK relationships keep
    // working without changing any models.
    public class GuestCheckoutDto
    {
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.EmailAddress]
        public string Email { get; set; } = string.Empty;

        [System.ComponentModel.DataAnnotations.Required]
        public string FullName { get; set; } = string.Empty;

        [System.ComponentModel.DataAnnotations.Required]
        public string PhoneNumber { get; set; } = string.Empty;

        // Shipping address — inline so the guest doesn't need a saved address.
        [System.ComponentModel.DataAnnotations.Required]
        public string Street { get; set; } = string.Empty;

        [System.ComponentModel.DataAnnotations.Required]
        public string City { get; set; } = string.Empty;

        public string? State { get; set; }
        public string? ZipCode { get; set; }

        [System.ComponentModel.DataAnnotations.Required]
        public string Country { get; set; } = string.Empty;

        // Order details
        [System.ComponentModel.DataAnnotations.Required]
        public string PaymentMethod { get; set; } = "COD"; // CreditCard | PayPal | COD | Wallet

        public string? Notes { get; set; }

        // The cart isn't stored server-side for guests, so the client sends it.
        [System.ComponentModel.DataAnnotations.Required, System.ComponentModel.DataAnnotations.MinLength(1)]
        public List<GuestCartItemDto> Items { get; set; } = new();
    }

    public class GuestCartItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}