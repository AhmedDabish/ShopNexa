using backend.Models;
public class Review
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int UserId { get; set; }
    public int Rating { get; set; } // 1-5
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsVerifiedPurchase { get; set; }

    public Product Product { get; set; }
    public User User { get; set; }
}