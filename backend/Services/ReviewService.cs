using backend.DTOs;
using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Services
{
    public class ReviewService
    {
        private readonly IReviewRepository _reviewRepo;
        private readonly IProductRepository _productRepo;

        public ReviewService(IReviewRepository reviewRepo, IProductRepository productRepo)
        {
            _reviewRepo = reviewRepo;
            _productRepo = productRepo;
        }

        public async Task<IEnumerable<Review>> GetProductReviewsAsync(int productId)
            => await _reviewRepo.GetReviewsByProductIdAsync(productId);

        public async Task<Review> AddReviewAsync(int userId, CreateReviewDto dto)
        {
            var hasPurchased = await _reviewRepo.HasUserPurchasedProductAsync(userId, dto.ProductId);
            var review = new Review
            {
                ProductId = dto.ProductId,
                UserId = userId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow,
                IsVerifiedPurchase = hasPurchased
            };
            await _reviewRepo.AddAsync(review);

            // تحديث متوسط التقييم للمنتج
            var avg = await _reviewRepo.GetAverageRatingForProductAsync(dto.ProductId);
            var product = await _productRepo.GetByIdAsync(dto.ProductId);
            product.AverageRating = avg;
            await _productRepo.UpdateAsync(product);

            return review;
        }

        public async Task<bool> DeleteReviewAsync(int reviewId, int userId, bool isAdmin = false)
        {
            var review = await _reviewRepo.GetByIdAsync(reviewId);
            if (review == null) return false;
            if (!isAdmin && review.UserId != userId) return false;
            await _reviewRepo.DeleteAsync(review);
            return true;
        }
    }
}