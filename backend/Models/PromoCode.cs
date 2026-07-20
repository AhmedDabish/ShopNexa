public class PromoCode
{
    public int Id { get; set; }
    public string Code { get; set; }
    public string Description { get; set; }
    public string DiscountType { get; set; } // Percentage, FixedAmount
    public decimal DiscountValue { get; set; }
    public decimal? MinimumOrderAmount { get; set; }
    public int? MaxUsageCount { get; set; }
    public int UsedCount { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; }

    public ICollection<Order> Orders { get; set; }
}