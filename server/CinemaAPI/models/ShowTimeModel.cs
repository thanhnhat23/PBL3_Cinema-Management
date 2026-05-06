using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Models
{

    public enum PricingModel
    {
        PriceBased = 0,
        SeatBased = 1,
        Mixed = 2
    }

    [Index(nameof(movie_id), nameof(startTime))]
    [Index(nameof(room_id), nameof(startTime))]
    [Index(nameof(startTime))]
    public class ShowTime
    {
        [Key]
        public int showtime_id { get; set; }

        [JsonIgnore]
        public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public virtual ICollection<ShowTimeSeat> ShowTimeSeats { get; set; } = new List<ShowTimeSeat>();
        public virtual ICollection<ShowTimePrice> ShowTimePrices { get; set; } = new List<ShowTimePrice>();

        public int room_id { get; set; }
        [ForeignKey("room_id")]
        public virtual Room Room { get; set; } = null!;

        public int movie_id { get; set; }
        [ForeignKey("movie_id")]
        public virtual Movie Movie { get; set; } = null!;

        // Optional reference to a reusable time slot. Kept nullable so migration can be done separately.
        public int? slot_id { get; set; }
        [ForeignKey("slot_id")]
        public virtual ShowTimeSlot? Slot { get; set; }

        public PricingModel pricing_model { get; set; } = PricingModel.PriceBased;

        [JsonConverter(typeof(TmdbService.DateTimeConverter))]
        public DateTime startTime { get; set; }

        [JsonConverter(typeof(TmdbService.DateTimeConverter))]
        public DateTime endTime { get; set; }

        public DateTime? deleted_at { get; set; }
        public Guid? deleted_by { get; set; }

        [NotMapped]
        [System.Text.Json.Serialization.JsonInclude]
        public int? cinema_id
        {
            get => Room?.Cinema?.cinema_id;
        }
    }
}