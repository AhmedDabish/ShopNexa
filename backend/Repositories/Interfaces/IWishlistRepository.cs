using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IWishlistRepository : IGenericRepository<Wishlist>
    {
        Task<Wishlist?> GetWishlistByUserIdAsync(int userId);
        Task<bool> IsProductInWishlistAsync(int userId, int productId);
    }
}