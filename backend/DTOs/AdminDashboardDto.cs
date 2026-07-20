namespace backend.DTOs
{
    public class AdminDashboardDto
    {
        public decimal TotalSales { get; set; }
        public int TotalOrders { get; set; }
        public int TotalUsers { get; set; }
        public int TotalProducts { get; set; }
        public int PendingOrders { get; set; }
        public List<RecentOrderDto> RecentOrders { get; set; }
        public List<MonthlySalesDto> MonthlySales { get; set; }
    }

    public class RecentOrderDto
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; }
        public string CustomerName { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public DateTime OrderDate { get; set; }
    }

    public class MonthlySalesDto
    {
        public string Month { get; set; }
        public decimal Sales { get; set; }
    }
}