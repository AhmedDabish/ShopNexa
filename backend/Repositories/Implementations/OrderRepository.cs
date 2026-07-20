using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Implementations
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        public OrderRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(int userId)
            => await _dbSet.Where(o => o.UserId == userId)
                           .OrderByDescending(o => o.OrderDate)
                           .Include(o => o.OrderItems)
                           .ThenInclude(oi => oi.Product)
                           .ThenInclude(p => p.Images)
                           .ToListAsync();

        public async Task<Order?> GetOrderWithDetailsAsync(int orderId)
            => await _dbSet.Include(o => o.OrderItems)
                           .ThenInclude(oi => oi.Product)
                           .ThenInclude(p => p.Images)
                           .Include(o => o.ShippingAddress)
                           .Include(o => o.Payment)
                           .FirstOrDefaultAsync(o => o.Id == orderId);

        //public async Task<IEnumerable<Order>> GetAllOrdersWithDetailsAsync(int page, int pageSize, string? status = null)
        //{
        //    var query = _dbSet.Include(o => o.User)
        //                      .Include(o => o.OrderItems)
        //                      .AsQueryable();
        //    if (!string.IsNullOrEmpty(status))
        //        query = query.Where(o => o.Status == status);
        //    return await query.OrderByDescending(o => o.OrderDate)
        //                      .Skip((page - 1) * pageSize)
        //                      .Take(pageSize)
        //                      .ToListAsync();
        //}
        public async Task<IEnumerable<Order>> GetAllOrdersWithDetailsAsync(int page, int pageSize, string? status = null)
        {
            var query = _dbSet.Include(o => o.User)
                              .Include(o => o.OrderItems)
                                  .ThenInclude(oi => oi.Product)
                                      .ThenInclude(p => p.Images)
                              .AsQueryable();
            if (!string.IsNullOrEmpty(status))
                query = query.Where(o => o.Status == status);
            return await query.OrderByDescending(o => o.OrderDate)
                              .Skip((page - 1) * pageSize)
                              .Take(pageSize)
                              .ToListAsync();
        }

        public async Task<int> GetPendingOrdersCountAsync()
            => await _dbSet.CountAsync(o => o.Status == "Pending");

        public async Task<decimal> GetTotalSalesAsync()
            => await _dbSet.Where(o => o.Status == "Delivered" || o.Status == "Shipped")
                           .SumAsync(o => o.TotalAmount);


        public async Task<List<MonthlySalesDto>> GetMonthlySalesAsync(int months = 6)
        {
            var startDate = DateTime.UtcNow.AddMonths(-months);
            var orders = await _dbSet
                .Where(o => (o.Status == "Delivered" || o.Status == "Shipped") && o.OrderDate >= startDate)
                .GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month })
                .Select(g => new MonthlySalesDto
                {
                    Month = $"{g.Key.Year}-{g.Key.Month:00}",
                    Sales = g.Sum(o => o.TotalAmount)
                })
                .OrderBy(m => m.Month)
                .ToListAsync();
            return orders;
        }



        public async Task<List<MonthlySalesStatsDto>> GetMonthlySalesStatsAsync(int months = 6)
        {
            var startDate = DateTime.UtcNow.AddMonths(-months);
            return await _dbSet
                .Where(o => (o.Status == "Delivered" || o.Status == "Shipped") && o.OrderDate >= startDate)
                .GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month })
                .Select(g => new MonthlySalesStatsDto
                {
                    Month = $"{g.Key.Year}-{g.Key.Month:00}",
                    Revenue = g.Sum(o => o.TotalAmount),
                    OrdersCount = g.Count()
                })
                .OrderBy(m => m.Month)
                .ToListAsync();
        }

        public async Task<List<OrderStatusStatsDto>> GetOrderStatusStatsAsync()
        {
            return await _dbSet
                .GroupBy(o => o.Status)
                .Select(g => new OrderStatusStatsDto
                {
                    Status = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();
        }

        public async Task<List<TopProductDto>> GetTopProductsAsync(int top = 5)
        {
            return await _context.OrderItems
                .Include(oi => oi.Product)
                .GroupBy(oi => oi.ProductId)
                .Select(g => new TopProductDto
                {
                    ProductId = g.Key,
                    ProductName = g.First().Product.Name,
                    TotalQuantity = g.Sum(oi => oi.Quantity),
                    TotalRevenue = g.Sum(oi => oi.TotalPrice)
                })
                .OrderByDescending(t => t.TotalQuantity)
                .Take(top)
                .ToListAsync();
        }
    }
}