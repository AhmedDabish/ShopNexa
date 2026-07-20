using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IReviewRepository : IGenericRepository<Review>
    {
        Task<IEnumerable<Review>> GetReviewsByProductIdAsync(int productId);
        Task<double> GetAverageRatingForProductAsync(int productId);
        Task<bool> HasUserPurchasedProductAsync(int userId, int productId);
    }
}