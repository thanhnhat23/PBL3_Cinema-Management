using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Models
{
    public enum ShowTimeSeatStatus
    {
        Available = 0,
        Booked = 1,
        Holding = 2
    }

    [Index(nameof(showtime_id), nameof(status))]
    [Index(nameof(showtime_id), nameof(seat_id), IsUnique = true)]
    [Index(nameof(hold_token))]
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

        public string? hold_token { get; set; }

        [JsonConverter(typeof(TmdbService.NullableDateTimeConverter))]
        public DateTime? hold_expires_at { get; set; }
        
        public string? held_by_user { get; set; }
        public DateOnly? deleted_at { get; set; }
    }
}