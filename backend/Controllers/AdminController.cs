using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Repositories.Interfaces;
using backend.Services;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly IOrderRepository _orderRepo;
        private readonly IProductRepository _productRepo;
        private readonly OrderService _orderService;

        public AdminController(
            IUserRepository userRepo,
            IOrderRepository orderRepo,
            IProductRepository productRepo,
            OrderService orderService)
        {
            _userRepo = userRepo;
            _orderRepo = orderRepo;
            _productRepo = productRepo;
            _orderService = orderService;
        }

        // ───────────────────────── Users ─────────────────────────

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepo.GetAllAsync();
            return Ok(users);
        }

        [HttpPut("users/{id}/approve")]
        public async Task<IActionResult> ApproveUser(int id)
        {
            var user = await _userRepo.GetByIdAsync(id);
            if (user == null) return NotFound();
            user.IsActive = true;
            await _userRepo.UpdateAsync(user);
            return Ok(new { message = "User approved" });
        }

        [HttpPut("users/{id}/restrict")]
        public async Task<IActionResult> RestrictUser(int id)
        {
            var user = await _userRepo.GetByIdAsync(id);
            if (user == null) return NotFound();
            user.IsActive = false;
            await _userRepo.UpdateAsync(user);
            return Ok(new { message = "User restricted" });
        }

        // ───────────────────────── Orders ─────────────────────────

        // Returns a lightweight projection so the admin table can render
        // without dragging the entire User/OrderItem graph over the wire.
        [HttpGet("orders")]
        public async Task<IActionResult> GetAllOrders(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? status = null)
        {
            var orders = await _orderRepo.GetAllOrdersWithDetailsAsync(page, pageSize, status);
            var result = orders.Select(o => new
            {
                id = o.Id,
                orderNumber = o.OrderNumber,
                userId = o.UserId,
                customerName = o.User != null ? o.User.FullName : $"User #{o.UserId}",
                orderDate = o.OrderDate,
                totalAmount = o.TotalAmount,
                status = o.Status,
                paymentMethod = o.PaymentMethod,
                paymentStatus = o.PaymentStatus
            });
            return Ok(result);
        }

        [HttpPut("orders/{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, UpdateOrderStatusDto dto)
        {
            var result = await _orderService.UpdateOrderStatusAsync(id, dto.Status, dto.TrackingNumber);
            if (!result) return NotFound();
            return Ok(new { message = "Order status updated" });
        }

        // ───────────────────────── Dashboard ─────────────────────────

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var totalSales = await _orderRepo.GetTotalSalesAsync();
            var totalOrders = await _orderRepo.CountAsync();
            var totalUsers = await _userRepo.CountAsync();
            var totalProducts = await _productRepo.CountAsync(p => p.IsActive);
            var pendingOrders = await _orderRepo.GetPendingOrdersCountAsync();
            var recentOrders = (await _orderRepo.GetAllOrdersWithDetailsAsync(1, 5))
                .Select(o => new RecentOrderDto
                {
                    Id = o.Id,
                    OrderNumber = o.OrderNumber,
                    CustomerName = o.User?.FullName ?? "Unknown",
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    OrderDate = o.OrderDate
                })
                .ToList();

            // Return both totalRevenue (new name expected by the FE) and
            // totalSales (legacy name) so older clients keep working.
            return Ok(new
            {
                totalRevenue = totalSales,
                totalSales = totalSales,
                totalOrders = totalOrders,
                totalUsers = totalUsers,
                totalProducts = totalProducts,
                pendingOrders = pendingOrders,
                recentOrders = recentOrders
            });
        }

        // ───────────────────────── Charts ─────────────────────────

        // Monthly revenue + order counts for the last N months. Fills in
        // missing months with zeros so the chart x-axis stays uniform.
        [HttpGet("monthly-sales-stats")]
        public async Task<IActionResult> GetMonthlySalesStats([FromQuery] int months = 6)
        {
            if (months < 1 || months > 24) months = 6;

            var since = DateTime.UtcNow.AddMonths(-months + 1);
            var startOfMonth = new DateTime(since.Year, since.Month, 1);

            var orders = await _orderRepo.GetAllAsync();
            var rows = orders
                .Where(o => o.OrderDate >= startOfMonth && o.Status != "Cancelled")
                .GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Revenue = g.Sum(o => o.TotalAmount),
                    OrdersCount = g.Count()
                })
                .OrderBy(r => r.Year).ThenBy(r => r.Month)
                .ToList();

            var result = new List<object>();
            for (int i = 0; i < months; i++)
            {
                var d = startOfMonth.AddMonths(i);
                var match = rows.FirstOrDefault(r => r.Year == d.Year && r.Month == d.Month);
                result.Add(new
                {
                    month = d.ToString("MMM yyyy"),
                    revenue = match?.Revenue ?? 0m,
                    ordersCount = match?.OrdersCount ?? 0
                });
            }
            return Ok(result);
        }

        // Order count grouped by status — feeds the pie chart.
        [HttpGet("order-status-stats")]
        public async Task<IActionResult> GetOrderStatusStats()
        {
            var orders = await _orderRepo.GetAllAsync();
            var rows = orders
                .GroupBy(o => o.Status)
                .Select(g => new { status = g.Key, count = g.Count() })
                .OrderByDescending(r => r.count)
                .ToList();
            return Ok(rows);
        }

        // Top selling products by units. Pulls a wide page of orders and
        // aggregates client-side; for very large stores you'd push this
        // grouping into the database, but for a few thousand orders it's fine.
        // Top selling products by units. Pulls a wide page of orders and
        // aggregates client-side; for very large stores you'd push this
        // grouping into the database, but for a few thousand orders it's fine.
        [HttpGet("top-products")]
        public async Task<IActionResult> GetTopProducts([FromQuery] int count = 5)
        {
            if (count < 1 || count > 50) count = 5;

            var orders = await _orderRepo.GetAllOrdersWithDetailsAsync(1, 1000);
            var rows = orders
                .Where(o => o.OrderItems != null)
                .SelectMany(o => o.OrderItems)
                .GroupBy(oi => new { oi.ProductId, ProductName = oi.Product != null ? oi.Product.Name : null })
                .Select(g => new
                {
                    productId = g.Key.ProductId,
                    name = g.Key.ProductName ?? "(deleted)",
                    unitsSold = g.Sum(oi => oi.Quantity),
                    revenue = g.Sum(oi => oi.UnitPrice * oi.Quantity)
                })
                .OrderByDescending(r => r.unitsSold)
                .Take(count)
                .ToList();

            return Ok(rows);
        }
    }
}