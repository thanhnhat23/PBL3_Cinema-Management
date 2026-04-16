using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CinemaAPI.Models
{
    public enum SeatEnum
    {
        Single = 1,
        Couple = 2
    }

    public class SeatType
    {
        [Key]
        public int type_id { get; set; }

        [JsonIgnore]
        public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();
        [JsonIgnore]
        public virtual ICollection<ShowTimePrice> ShowTimePrices { get; set; } = new List<ShowTimePrice>();

        public SeatEnum type_name { get; set; } = SeatEnum.Single;
        public DateOnly? deleted_at { get; set; }
    }
}