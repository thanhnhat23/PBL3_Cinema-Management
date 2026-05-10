using CinemaAPI.Models;

namespace CinemaAPI.Models.DTOs
{
    public class CouponCreateRequest
    {
        public string? code { get; set; } = null;
        public DiscountType type { get; set; } = DiscountType.Percentage;
        public CouponType coupon_type { get; set; } = CouponType.Limited;
        public string description { get; set; } = "No description";

        public decimal discountValue { get; set; } = 0;
        public decimal maxDiscountAmount { get; set; } = 0;
        public decimal minOrderValue { get; set; } = 0;

        public int? max_usage { get; set; }

        public DateTime startDate { get; set; } = DateTime.UtcNow;
        public DateTime endDate { get; set; } = DateTime.UtcNow.AddMonths(1);

        public bool isHoliday { get; set; } = false;
        public string? applies_to { get; set; }
    }

    public class CouponUpdateRequest
    {
        public string? code { get; set; } = null;
        public DiscountType? type { get; set; } = null;
        public CouponType? coupon_type { get; set; } = null;
        public CouponStatus? status { get; set; } = null;
        public string? description { get; set; } = null;

        public decimal? discountValue { get; set; } = null;
        public decimal? maxDiscountAmount { get; set; } = null;
        public decimal? minOrderValue { get; set; } = null;

        public int? max_usage { get; set; }

        public DateTime? startDate { get; set; } = null;
        public DateTime? endDate { get; set; } = null;

        public bool? isHoliday { get; set; } = null;
        public string? applies_to { get; set; }
    }
}