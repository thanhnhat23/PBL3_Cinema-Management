using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Models
{
    public enum BookingStatus
    {
        Pending = 0,
        Confirmed = 1,
        Cancelled = 2,
        Refunded = 3
    }

    [Index(nameof(user_id), nameof(createAt), IsDescending = new[] { false, true })]
    [Index(nameof(status))]
    [Index(nameof(user_id), nameof(status))]
    [Index(nameof(createAt))]
    public class Booking
    {
        [Key]
        public int booking_id { get; set; }

        public virtual ICollection<BookingSnacks> BookingSnacks { get; set; } = new List<BookingSnacks>();
        public virtual ICollection<ShowTimeSeat> ShowTimeSeats { get; set; } = new List<ShowTimeSeat>();
        public virtual ICollection<VnpayPayment> VnpayPayments { get; set; } = new List<VnpayPayment>();
        public virtual ICollection<MomoPayment> MomoPayments { get; set; } = new List<MomoPayment>();

        [JsonIgnore]
        public virtual PointTransaction? PointTransaction { get; set; }

        public Guid user_id { get; set; }
        [ForeignKey("user_id")]
        public virtual User User { get; set; } = null!;

        public int showtime_id { get; set; }
        [ForeignKey("showtime_id")]
        public virtual ShowTime ShowTime { get; set; } = null!;

        public int? coupon_id { get; set; }
        [ForeignKey("coupon_id")]
        public virtual Coupon? Coupon { get; set; }

        [Required]
        public decimal totalAmount { get; set; }

        public decimal? discountAmount { get; set; }
        public decimal finalAmount { get; set; }
        public BookingStatus status { get; set; }

        [JsonConverter(typeof(TmdbService.DateTimeConverter))]
        public DateTime createAt { get; set; } = DateTime.UtcNow;

        public Guid? processed_by { get; set; }
        [ForeignKey("processed_by")]
        public virtual User? Processor { get; set; }
    }
}