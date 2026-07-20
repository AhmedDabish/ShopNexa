using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Implementations
{
    public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Category>> GetActiveCategoriesAsync()
            => await _dbSet.Where(c => c.IsActive).ToListAsync();

        public async Task<Category?> GetCategoryWithSubsAsync(int id)
            => await _dbSet.Include(c => c.SubCategories)
                           .FirstOrDefaultAsync(c => c.Id == id);
    }
}