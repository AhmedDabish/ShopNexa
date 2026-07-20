using backend.Models;
public class SellerProfile
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string StoreName { get; set; }
    public string? StoreDescription { get; set; }
    public string? LogoUrl { get; set; }
    public decimal TotalEarnings { get; set; }
    public decimal PendingPayouts { get; set; }
    public bool IsApproved { get; set; }
    public DateTime CreatedAt { get; set; }

    public User User { get; set; }
}