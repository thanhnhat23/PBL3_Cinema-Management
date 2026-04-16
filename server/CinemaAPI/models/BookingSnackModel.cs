using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaAPI.Models
{
    public class BookingSnacks
    {
        public int booking_id { get; set; }
        [ForeignKey("booking_id")]
        public virtual Booking Booking { get; set; } = null!;

        public int snack_id { get; set; }
        [ForeignKey("snack_id")]
        public virtual Snack Snack { get; set; } = null!;

        public int quantity { get; set; }
        public decimal price { get; set; }
        public DateOnly? deleted_at { get; set; }
    }
}