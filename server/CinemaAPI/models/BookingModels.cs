using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaAPI.Models
{
    public enum BookingStatus
    {
        Pending = 0,
        Confirmed = 1,
        Cancelled = 2
    }

    public enum Payment
    {
        CreditCard = 0,
        PayPal = 1,
        Cash = 2
    }

    public class Booking
    {
        [Key]
        public int booking_id { get; set; }

        public virtual ICollection<BookingSnacks> BookingSnacks { get; set; } = new List<BookingSnacks>();
        public virtual ICollection<ShowTimeSeat> ShowTimeSeats { get; set; } = new List<ShowTimeSeat>(); 

        public Guid user_id { get; set; }
        [ForeignKey("user_id")]
        public virtual User User { get; set; } = null!;

        public int showtime_id { get; set; }
        [ForeignKey("showtime_id")]
        public virtual ShowTime ShowTime { get; set; } = null!;

        [Required]
        public decimal totalAmount { get; set; }
        
        public decimal? discountAmount { get; set; }
        public decimal finalAmount { get; set; }
        public Payment paymentMethod { get; set; }
        public BookingStatus status { get; set; }

        public DateTime bookingTime { get; set; } = DateTime.UtcNow;

    }
}