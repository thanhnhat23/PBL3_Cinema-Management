using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Models
{
    public enum DiscountType
    {
        Percentage = 0,
        FixedAmount = 1
    }

    public enum CouponType
    {
        Limited = 0,
        Holiday = 1,
        Never = 2
    }

    public enum CouponStatus
    {
        Active = 0,
        Expired = 1,
        Disabled = 2
    }

    [Index(nameof(code), IsUnique = true)]
    [Index(nameof(startDate), nameof(endDate))]
    public class Coupon
    {
        [Key]
        public int coupon_id { get; set; }

        [JsonIgnore]
        public virtual ICollection<UserVoucher> UserVouchers { get; set; } = new List<UserVoucher>();
        [JsonIgnore]
        public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

        [MaxLength(255)]
        public string? code { get; set; } = null;

        [MaxLength(255)]
        public string description { get; set; } = "No description";

        public DiscountType type { get; set; } = DiscountType.Percentage;
        public CouponType coupon_type { get; set; } = CouponType.Limited;
        public CouponStatus status { get; set; } = CouponStatus.Active;

        public decimal discountValue { get; set; } = 0;
        public decimal maxDiscountAmount { get; set; } = 0;
        public decimal minOrderValue { get; set; } = 0;

        public int? max_usage { get; set; }
        public int current_usage { get; set; } = 0;

        [JsonConverter(typeof(TmdbService.DateTimeConverter))]
        public DateTime startDate { get; set; } = DateTime.UtcNow;

        [JsonConverter(typeof(TmdbService.DateTimeConverter))]
        public DateTime endDate { get; set; } = DateTime.UtcNow.AddMonths(1);

        public bool isHoliday { get; set; } = false;

        [NotMapped]
        public bool IsActive 
        {
            get 
            {
                if (status != CouponStatus.Active) return false;
                if (coupon_type == CouponType.Never) return true;
                
                var now = DateTime.UtcNow;
                if (coupon_type == CouponType.Holiday)
                {
                    // Holiday is valid for 3 days starting from startDate (startDate + 2 days)
                    return now >= startDate && now <= startDate.AddDays(2);
                }

                return now >= startDate && now <= endDate && (max_usage == null || current_usage < max_usage);
            }
        }

        public string? applies_to { get; set; } // Ticket, Snack, Both
        public DateTime? last_reset_at { get; set; } // For Holiday reset logic
        public DateTime? deleted_at { get; set; }
        public Guid? deleted_by { get; set; }
    }
}