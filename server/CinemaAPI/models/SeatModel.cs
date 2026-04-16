using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Models
{
    [Index(nameof(room_id), nameof(seat_code))]
    public class Seat
    {
        [Key]
        public int seat_id { get; set; }

        [JsonIgnore]
        public virtual ICollection<ShowTimeSeat> ShowTimeSeats { get; set; } = new List<ShowTimeSeat>();

        public int room_id { get; set; }
        [JsonIgnore]
        [ForeignKey("room_id")]
        public virtual Room Room { get; set; } = null!;

        public int type_id { get; set; }
        [ForeignKey("type_id")]
        public virtual SeatType SeatType { get; set; } = null!;

        [Required]
        public int row_index { get; set; }

        [Required]
        public int column_index { get; set; }

        [Required, MaxLength(10)]
        public string seat_code { get; set; } = null!;
        public DateOnly? deleted_at { get; set; }
    }
}