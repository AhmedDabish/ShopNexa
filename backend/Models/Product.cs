using backend.Models;
using Microsoft.AspNetCore.Mvc.ViewEngines;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int StockQuantity { get; set; }
    public string SKU { get; set; }
    public int CategoryId { get; set; }
    public int? SellerId { get; set; } // null = Admin product
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; }
    public int ViewCount { get; set; }
    public double AverageRating { get; set; }

    // Navigation Properties
    public Category Category { get; set; }
    public User? Seller { get; set; }
    public ICollection<ProductImage> Images { get; set; }
    public ICollection<Review> Reviews { get; set; }
    public ICollection<CartItem> CartItems { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; }
    // أضف هذه الخاصية داخل Product.cs إذا لم تكن موجودة
    public ICollection<WishlistItem> WishlistItems { get; set; }
}