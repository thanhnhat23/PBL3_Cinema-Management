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
    // [Index(nameof(hold_token))]
    public class ShowTimeSeat
    {
        [Key]
        public int stseat_id { get; set; }

        public int seat_id { get; set; }
        [ForeignKey("seat_id")]
        public virtual Seat Seat { get; set; } = null!;

        public int showtime_id { get; set; }
        [ForeignKey("showtime_id")]
        [JsonIgnore]
        public virtual ShowTime ShowTime { get; set; } = null!;

        public int? booking_id { get; set; }
        [ForeignKey("booking_id")]
        [JsonIgnore]
        public virtual Booking? Booking { get; set; }

        public ShowTimeSeatStatus status { get; set; }

        // dùng để xử lý concurrency khi nhiều người dùng cố gắng đặt cùng một ghế trong cùng một thời điểm
        [Timestamp]
        public byte[]? RowVersion { get; set; }

        [NotMapped]
        public decimal Price { get; set; }
    }
}