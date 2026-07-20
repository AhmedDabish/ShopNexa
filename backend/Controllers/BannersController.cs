using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers
{
    // Routes:
    //   GET    /api/banners              -> active banners (public, used by home page)
    //   GET    /api/banners/all          -> ALL banners (Admin only, used by banner-list page)
    //   GET    /api/banners/{id}         -> single banner
    //   POST   /api/banners              -> create (Admin only)
    //   PUT    /api/banners/{id}         -> update (Admin only)
    //   DELETE /api/banners/{id}         -> delete (Admin only)
    [Route("api/[controller]")]
    [ApiController]
    public class BannersController : ControllerBase
    {
        private readonly BannerService _bannerService;

        public BannersController(BannerService bannerService)
        {
            _bannerService = bannerService;
        }

        // Public endpoint - returns only banners that are active AND within their date window.
        [HttpGet]
        public async Task<IActionResult> GetActive()
        {
            var banners = await _bannerService.GetActiveAsync();
            return Ok(banners);
        }

        // Admin endpoint - returns every banner regardless of state.
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var banners = await _bannerService.GetAllAsync();
            return Ok(banners);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var banner = await _bannerService.GetByIdAsync(id);
            if (banner == null) return NotFound();
            return Ok(banner);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] BannerCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (dto.EndDate < dto.StartDate)
                return BadRequest(new { message = "EndDate must be on or after StartDate." });

            var created = await _bannerService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] BannerCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (dto.EndDate < dto.StartDate)
                return BadRequest(new { message = "EndDate must be on or after StartDate." });

            var updated = await _bannerService.UpdateAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _bannerService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}