using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.DTOs;
using backend.Repositories.Interfaces;

namespace backend.Controllers
{
    // Endpoints:
    //   POST   /api/PromoCode/validate
    //   GET    /api/PromoCode               (Admin)
    //   POST   /api/PromoCode               (Admin)
    //   PUT    /api/PromoCode/{id}          (Admin)
    //   DELETE /api/PromoCode/{id}          (Admin)
    [Route("api/[controller]")]
    [ApiController]
    public class PromoCodeController : ControllerBase
    {
        private readonly IGenericRepository<PromoCode> _promoRepo;

        public PromoCodeController(IGenericRepository<PromoCode> promoRepo)
        {
            _promoRepo = promoRepo;
        }

        // Frontend sends { code, orderAmount } as a JSON body, so we bind the
        // whole thing to a DTO instead of splitting it between [FromBody] string
        // and [FromQuery] decimal — that combo can't deserialise the object the
        // client actually sends and returns 400 every time.
        [HttpPost("validate")]
        public async Task<IActionResult> Validate([FromBody] ValidatePromoCodeDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var promo = (await _promoRepo.FindAsync(p => p.Code == dto.Code && p.IsActive)).FirstOrDefault();
            if (promo == null)
                return BadRequest(new { valid = false, message = "Invalid promo code" });

            if (promo.StartDate > DateTime.UtcNow || promo.EndDate < DateTime.UtcNow)
                return BadRequest(new { valid = false, message = "Promo code expired" });

            if (promo.MinimumOrderAmount.HasValue && dto.OrderAmount < promo.MinimumOrderAmount.Value)
                return BadRequest(new { valid = false, message = $"Minimum order amount is {promo.MinimumOrderAmount.Value}" });

            if (promo.MaxUsageCount.HasValue && promo.UsedCount >= promo.MaxUsageCount.Value)
                return BadRequest(new { valid = false, message = "Promo code usage limit reached" });

            decimal discount = promo.DiscountType == "Percentage"
                ? dto.OrderAmount * promo.DiscountValue / 100
                : promo.DiscountValue;

            // Shape matches what payment.service.ts expects:
            //   { valid: boolean; discount: number; message?: string }
            return Ok(new { valid = true, discount, promoId = promo.Id });
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var promos = await _promoRepo.GetAllAsync();
            return Ok(promos);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] PromoCodeCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (dto.EndDate < dto.StartDate)
                return BadRequest(new { message = "EndDate must be on or after StartDate." });

            var promo = new PromoCode
            {
                Code = dto.Code,
                Description = dto.Description,
                DiscountType = dto.DiscountType,
                DiscountValue = dto.DiscountValue,
                MinimumOrderAmount = dto.MinimumOrderAmount,
                MaxUsageCount = dto.MaxUsageCount,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                IsActive = dto.IsActive,
                UsedCount = 0
            };
            await _promoRepo.AddAsync(promo);
            return Ok(promo);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] PromoCodeCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (dto.EndDate < dto.StartDate)
                return BadRequest(new { message = "EndDate must be on or after StartDate." });

            // Fetch the tracked entity and patch the editable fields so we
            // never overwrite UsedCount or touch the Orders navigation.
            var existing = await _promoRepo.GetByIdAsync(id);
            if (existing == null) return NotFound();

            existing.Code = dto.Code;
            existing.Description = dto.Description;
            existing.DiscountType = dto.DiscountType;
            existing.DiscountValue = dto.DiscountValue;
            existing.MinimumOrderAmount = dto.MinimumOrderAmount;
            existing.MaxUsageCount = dto.MaxUsageCount;
            existing.StartDate = dto.StartDate;
            existing.EndDate = dto.EndDate;
            existing.IsActive = dto.IsActive;

            await _promoRepo.UpdateAsync(existing);
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var promo = await _promoRepo.GetByIdAsync(id);
            if (promo == null) return NotFound();
            await _promoRepo.DeleteAsync(promo);
            return NoContent();
        }
    }
}