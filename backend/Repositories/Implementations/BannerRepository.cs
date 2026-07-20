using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Implementations
{
    public class BannerRepository : GenericRepository<Banner>, IBannerRepository
    {
        public BannerRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Banner>> GetActiveBannersAsync()
        {
            var now = DateTime.UtcNow;
            return await _dbSet
                .Where(b => b.IsActive && b.StartDate <= now && b.EndDate >= now)
                .OrderBy(b => b.DisplayOrder)
                .ToListAsync();
        }
    }
}