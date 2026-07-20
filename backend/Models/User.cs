using backend.Models;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using System.Data;
using System.Net;
using backend.Models;
namespace backend.Models;
public class User
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string PasswordHash { get; set; }
    public string? ProfileImage { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLogin { get; set; }
    public bool IsEmailConfirmed { get; set; }
    public string? EmailConfirmationToken { get; set; }
    public bool IsActive { get; set; } // للـ Soft Delete
    public decimal WalletBalance { get; set; } // Bonus
    public int? RoleId { get; set; }
    public Role Role { get; set; }

    // Navigation Properties
    public ICollection<Address> Addresses { get; set; }
    public ICollection<Order> Orders { get; set; }
    public ICollection<Review> Reviews { get; set; }
    public Wishlist Wishlist { get; set; }
    public Cart Cart { get; set; }
    public SellerProfile? SellerProfile { get; set; }
}