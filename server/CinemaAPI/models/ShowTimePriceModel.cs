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

        public int slot_id { get; set; }
        [ForeignKey("slot_id")]
        [JsonIgnore]
        public virtual ShowTimeSlot ShowTimeSlot{ get; set; } = null!;

        [Column(TypeName = "decimal(18, 2)")]
        public decimal base_price { get; set; }
    }
}