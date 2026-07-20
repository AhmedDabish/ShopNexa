using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Services
{
    public class WishlistService
    {
        private readonly IWishlistRepository _wishlistRepo;
        private readonly IProductRepository _productRepo;

        public WishlistService(IWishlistRepository wishlistRepo, IProductRepository productRepo)
        {
            _wishlistRepo = wishlistRepo;
            _productRepo = productRepo;
        }

        public async Task<Wishlist> GetWishlistAsync(int userId)
        {
            var wishlist = await _wishlistRepo.GetWishlistByUserIdAsync(userId);
            if (wishlist == null)
            {
                wishlist = new Wishlist { UserId = userId, CreatedAt = DateTime.UtcNow, Items = new List<WishlistItem>() };
                await _wishlistRepo.AddAsync(wishlist);
            }
            return wishlist;
        }

        public async Task AddToWishlistAsync(int userId, int productId)
        {
            var wishlist = await GetWishlistAsync(userId);
            if (wishlist.Items.Any(i => i.ProductId == productId)) return;
            wishlist.Items.Add(new WishlistItem { ProductId = productId, AddedAt = DateTime.UtcNow });
            await _wishlistRepo.UpdateAsync(wishlist);
        }

        public async Task RemoveFromWishlistAsync(int userId, int productId)
        {
            var wishlist = await GetWishlistAsync(userId);
            var item = wishlist.Items.FirstOrDefault(i => i.ProductId == productId);
            if (item != null)
            {
                wishlist.Items.Remove(item);
                await _wishlistRepo.UpdateAsync(wishlist);
            }
        }
    }
}