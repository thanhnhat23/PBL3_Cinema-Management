using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CinemaAPI.Models
{
    public class ShowTime
    {
        [Key]
        public int showtime_id { get; set; }

        [JsonIgnore]
        public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        [JsonIgnore]
        public virtual ICollection<ShowTimeSeat> ShowTimeSeats { get; set; } = new List<ShowTimeSeat>();

        public int room_id { get; set; }
        [ForeignKey("room_id")]
        public virtual Room Room { get; set; } = null!;

        public int movie_id { get; set; }
        [ForeignKey("movie_id")]
        public virtual Movie Movie { get; set; } = null!;

        public DateTime startTime { get; set; }
        public DateTime endTime { get; set; }
    }
}