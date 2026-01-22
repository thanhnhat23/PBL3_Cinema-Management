using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaAPI.Models
{
    public enum ShowTimeSeatStatus
    {
        Available = 0,
        Booked = 1
    }

    public class ShowTimeSeat
    {
        [Key]
        public int stseat_id { get; set; }

        public int seat_id { get; set; }
        [ForeignKey("seat_id")]
        public virtual Seat Seat { get; set; } = null!;

        public int showtime_id { get; set; }
        [ForeignKey("showtime_id")]
        public virtual ShowTime ShowTime { get; set; } = null!;

        public int? booking_id { get; set; }
        [ForeignKey("booking_id")]
        public virtual Booking? Booking { get; set; }

        public ShowTimeSeatStatus status { get; set; } 
    }
}