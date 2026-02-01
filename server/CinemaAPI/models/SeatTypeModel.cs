using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CinemaAPI.Models
{
    public class SeatType
    {
        [Key]
        public int type_id { get; set; }

        [JsonIgnore]
        public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();
        [JsonIgnore]
        public virtual ICollection<ShowTimePrice> ShowTimePrices { get; set; } = new List<ShowTimePrice>();

        [Required, MaxLength(50)]
        public string type_name { get; set; } = null!;
    }
}