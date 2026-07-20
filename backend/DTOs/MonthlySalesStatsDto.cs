// MonthlySalesStatsDto.cs
public class MonthlySalesStatsDto
{
    public string Month { get; set; }
    public decimal Revenue { get; set; }
    public int OrdersCount { get; set; }
}

// OrderStatusStatsDto.cs
public class OrderStatusStatsDto
{
    public string Status { get; set; }
    public int Count { get; set; }
}

// TopProductDto.cs
public class TopProductDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; }
    public int TotalQuantity { get; set; }
    public decimal TotalRevenue { get; set; }
}