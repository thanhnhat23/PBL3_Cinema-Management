using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CinemaAPI.Models
{
    public enum SeatType
    {
        Single = 0,
        Couple = 1
    }

    public class Seat
    {
        [Key]
        public int seat_id { get; set; }

        public virtual ICollection<ShowTimeSeat> ShowTimeSeats { get; set; } = new List<ShowTimeSeat>();

        public int room_id { get; set; }
        [JsonIgnore]
        [ForeignKey("room_id")]
        public virtual Room Room { get; set; } = null!;

        [Required]
        public int rowNumber { get; set; }

        [Required]
        public int columnNumber { get; set; }

        [Required, MaxLength(10)]
        public string seatCode { get; set; } = null!;

        public SeatType type { get; set; }
    }
}