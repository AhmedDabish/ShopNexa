using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Implementations
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        public ProductRepository(AppDbContext context) : base(context) { }


        public IQueryable<Product> GetAll()
        {
            return _dbSet.AsQueryable();
        }



        public async Task<List<Product>> GetAllWithImagesAsync()
        {
            return await _dbSet
                .Include(p => p.Images)
                .Where(p => p.IsActive)
                .ToListAsync();
        }



        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);
        }


        public async Task<IEnumerable<Product>> GetFeaturedProductsAsync(int count)
            => await _dbSet.Where(p => p.IsActive)
                           .OrderByDescending(p => p.ViewCount)
                           .Take(count)
                           .Include(p => p.Images)
                           .ToListAsync();

        public async Task<IEnumerable<Product>> GetByCategoryAsync(int categoryId)
            => await _dbSet.Where(p => p.CategoryId == categoryId && p.IsActive)
                           .Include(p => p.Images)
                           .ToListAsync();

        public async Task<IEnumerable<Product>> SearchAsync(string keyword)
            => await _dbSet.Where(p => p.Name.Contains(keyword) || p.Description.Contains(keyword))
                           .Include(p => p.Images)
                           .ToListAsync();
    }
}