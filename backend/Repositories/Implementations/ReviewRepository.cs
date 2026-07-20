using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Implementations
{
    public class ReviewRepository : GenericRepository<Review>, IReviewRepository
    {
        public ReviewRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Review>> GetReviewsByProductIdAsync(int productId)
            => await _dbSet.Where(r => r.ProductId == productId)
                           .Include(r => r.User)
                           .OrderByDescending(r => r.CreatedAt)
                           .ToListAsync();

        public async Task<double> GetAverageRatingForProductAsync(int productId)
        {
            var reviews = await _dbSet.Where(r => r.ProductId == productId).ToListAsync();
            if (!reviews.Any()) return 0;
            return reviews.Average(r => r.Rating);
        }

        public async Task<bool> HasUserPurchasedProductAsync(int userId, int productId)
        {
            return await _context.Orders
                .AnyAsync(o => o.UserId == userId && o.Status == "Delivered" &&
                               o.OrderItems.Any(oi => oi.ProductId == productId));
        }
    }
}