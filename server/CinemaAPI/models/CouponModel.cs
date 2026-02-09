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
        public string description { get; set; } = "No description";

        public DiscountType type { get; set; } = DiscountType.Percentage;
        public decimal discountValue { get; set; } = 0;
        public decimal maxDiscountAmount { get; set; } = 0;
        public decimal minOrderValue { get; set; } = 0;
        public DateTime startDate { get; set; } = DateTime.UtcNow;
        public DateTime endDate { get; set; } = DateTime.UtcNow.AddMonths(1);
        public bool isHoliday { get; set; } = false;

        [NotMapped]
        public bool IsActive => DateTime.UtcNow >= startDate && DateTime.UtcNow <= endDate;

        public string? applies_to { get; set; } // Ticket, Snack, Both
    }
}