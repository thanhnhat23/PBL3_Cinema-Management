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
        public string? description { get; set; } = null;

        public DiscountType type { get; set; }
        public decimal? discountValue { get; set; } = null;
        public decimal? maxDiscountAmount { get; set; } = null;
        public decimal? minOrderValue { get; set; } = null;
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
        public bool isHoliday { get; set; }

        [NotMapped]
        public bool IsActive => DateTime.UtcNow >= startDate && DateTime.UtcNow <= endDate;

        public string? applies_to { get; set; } // Ticket, Snack, Both
    }
}