using backend.DTOs;
using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Services
{
    public class BannerService
    {
        private readonly IBannerRepository _bannerRepo;

        public BannerService(IBannerRepository bannerRepo)
        {
            _bannerRepo = bannerRepo;
        }

        // For admin: all banners regardless of active/date window.
        public async Task<IEnumerable<Banner>> GetAllAsync()
            => await _bannerRepo.GetAllAsync();

        // For public/home: only active banners that are within their start/end window.
        public async Task<IEnumerable<Banner>> GetActiveAsync()
            => await _bannerRepo.GetActiveBannersAsync();

        public async Task<Banner?> GetByIdAsync(int id)
            => await _bannerRepo.GetByIdAsync(id);

        public async Task<Banner> CreateAsync(BannerCreateUpdateDto dto)
        {
            var banner = new Banner
            {
                Title = dto.Title,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl,
                LinkUrl = dto.LinkUrl,
                DisplayOrder = dto.DisplayOrder,
                IsActive = dto.IsActive,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate
            };
            return await _bannerRepo.AddAsync(banner);
        }

        // Returns null when the banner doesn't exist so the controller can return 404.
        public async Task<Banner?> UpdateAsync(int id, BannerCreateUpdateDto dto)
        {
            var banner = await _bannerRepo.GetByIdAsync(id);
            if (banner == null) return null;

            banner.Title = dto.Title;
            banner.Description = dto.Description;
            banner.ImageUrl = dto.ImageUrl;
            banner.LinkUrl = dto.LinkUrl;
            banner.DisplayOrder = dto.DisplayOrder;
            banner.IsActive = dto.IsActive;
            banner.StartDate = dto.StartDate;
            banner.EndDate = dto.EndDate;

            await _bannerRepo.UpdateAsync(banner);
            return banner;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var banner = await _bannerRepo.GetByIdAsync(id);
            if (banner == null) return false;
            await _bannerRepo.DeleteAsync(banner);
            return true;
        }
    }
}