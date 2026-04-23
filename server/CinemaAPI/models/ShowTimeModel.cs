using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Models
{
    [Index(nameof(movie_id), nameof(startTime))]
    [Index(nameof(room_id), nameof(startTime))]
    [Index(nameof(startTime))]
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

        [JsonConverter(typeof(TmdbService.DateTimeConverter))]
        public DateTime startTime { get; set; }

        [JsonConverter(typeof(TmdbService.DateTimeConverter))]
        public DateTime endTime { get; set; }
        public DateTime? deleted_at { get; set; }

        public Guid? deleted_by { get; set; }
    }
}