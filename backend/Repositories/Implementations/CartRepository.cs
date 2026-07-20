using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Implementations
{
    public class CartRepository : GenericRepository<Cart>, ICartRepository
    {
        public CartRepository(AppDbContext context) : base(context) { }

        public async Task<Cart?> GetCartByUserIdAsync(int userId)
            => await _dbSet.Include(c => c.CartItems)
                           .ThenInclude(ci => ci.Product)
                           .ThenInclude(p => p.Images)
                           .FirstOrDefaultAsync(c => c.UserId == userId);
    }
}