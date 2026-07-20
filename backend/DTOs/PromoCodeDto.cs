using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    // Plain shape for incoming promo code requests. Doesn't include the
    // ICollection<Order> navigation that the EF model has, so the frontend
    // doesn't need to send (or even know about) it. Without this DTO the
    // model binder treats Orders as a required property under nullable-
    // reference-types and rejects every request with a 400.
    public class PromoCodeCreateUpdateDto
    {
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string Code { get; set; } = string.Empty;

        [Required, MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string DiscountType { get; set; } = "Percentage"; // Percentage | FixedAmount

        [Range(0.01, double.MaxValue, ErrorMessage = "Discount value must be greater than 0.")]
        public decimal DiscountValue { get; set; }

        public decimal? MinimumOrderAmount { get; set; }
        public int? MaxUsageCount { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public bool IsActive { get; set; } = true;
    }

    // Shape used by POST /api/PromoCode/validate. The frontend sends a JSON
    // body like { code: "SUMMER20", orderAmount: 150 } — both fields live
    // in the body, not split between body and query string.
    public class ValidatePromoCodeDto
    {
        [Required, MaxLength(50)]
        public string Code { get; set; } = string.Empty;

        [Range(0, double.MaxValue)]
        public decimal OrderAmount { get; set; }
    }
}