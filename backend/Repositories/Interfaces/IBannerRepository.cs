using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IBannerRepository : IGenericRepository<Banner>
    {
        // Banners that are currently active AND within their start/end date window.
        // Used by the public home page.
        Task<IEnumerable<Banner>> GetActiveBannersAsync();
    }
}