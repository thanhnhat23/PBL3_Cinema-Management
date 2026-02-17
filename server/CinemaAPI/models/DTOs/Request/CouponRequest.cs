using CinemaAPI.Models;

namespace CinemaAPI.Models.DTOs
{
    public class CouponCreateRequest
    {
        public DiscountType type { get; set; } = DiscountType.Percentage;
        public string description { get; set; } = "No description";

        public decimal discountValue { get; set; } = 0;

        public decimal maxDiscountAmount { get; set; } = 0;

        public decimal minOrderValue { get; set; } = 0;

        public bool isHoliday { get; set; } = false;
    }

    public class CouponUpdateRequest
    {
        public DiscountType? type { get; set; } = null;
        public string? description { get; set; } = null;

        public decimal? discountValue { get; set; } = null;

        public decimal? maxDiscountAmount { get; set; } = null;

        public decimal? minOrderValue { get; set; } = null;

        public DateTime? startDate { get; set; } = null;

        public DateTime? endDate { get; set; } = null;

        public bool? isHoliday { get; set; } = null;
    }
}