using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Services
{
    public class CategoryService
    {
        private readonly ICategoryRepository _categoryRepo;

        public CategoryService(ICategoryRepository categoryRepo)
        {
            _categoryRepo = categoryRepo;
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
            => await _categoryRepo.GetAllAsync();

        public async Task<Category?> GetCategoryByIdAsync(int id)
            => await _categoryRepo.GetByIdAsync(id);

        public async Task<Category> CreateCategoryAsync(Category category)
            => await _categoryRepo.AddAsync(category);

        public async Task UpdateCategoryAsync(Category category)
            => await _categoryRepo.UpdateAsync(category);

        public async Task DeleteCategoryAsync(int id)
        {
            var category = await _categoryRepo.GetByIdAsync(id);
            if (category != null) await _categoryRepo.DeleteAsync(category);
        }
    }
}