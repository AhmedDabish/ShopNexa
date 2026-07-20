using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Implementations
{
    public class WishlistRepository : GenericRepository<Wishlist>, IWishlistRepository
    {
        public WishlistRepository(AppDbContext context) : base(context) { }

        public async Task<Wishlist?> GetWishlistByUserIdAsync(int userId)
            => await _dbSet.Include(w => w.Items)
                           .ThenInclude(i => i.Product)
                           .ThenInclude(p => p.Images)
                           .FirstOrDefaultAsync(w => w.UserId == userId);

        public async Task<bool> IsProductInWishlistAsync(int userId, int productId)
        {
            var wishlist = await GetWishlistByUserIdAsync(userId);
            return wishlist != null && wishlist.Items.Any(i => i.ProductId == productId);
        }
    }
}