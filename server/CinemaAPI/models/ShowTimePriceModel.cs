using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CinemaAPI.Models
{
    public class ShowTimePrice
    {
        public int type_id { get; set; }
        [ForeignKey("type_id")]
        public virtual SeatType SeatType{ get; set; } = null!;

        public int showtime_id { get; set; }
        [ForeignKey("showtime_id")]
        [JsonIgnore]
        public virtual ShowTime ShowTime{ get; set; } = null!;

        public decimal base_price { get; set; }
    }
}