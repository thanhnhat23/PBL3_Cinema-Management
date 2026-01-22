using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CinemaAPI.Models
{
    public enum DiscountType
    {
        Percentage = 0,
        FixedAmount = 1
    }

    public class Coupon
    {
        [Key]
        public int coupon_id { get; set; }

        public virtual ICollection<UserVoucher> UserVouchers { get; set; } = new List<UserVoucher>();

        [MaxLength(255)]
        public string? code { get; set; } = null;

        [MaxLength(255)]
        public string? description { get; set; } = null;
        
        public DiscountType type { get; set; }
        public decimal? discountValue { get; set;} = null;
        public decimal? maxDiscountAmount { get; set; } = null;
        public decimal? minOrderValue { get; set; } = null;
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
        public bool isHoliday { get; set; }

        [NotMapped]
        public bool IsActive => DateTime.UtcNow >= startDate && DateTime.UtcNow <= endDate;
    }
}