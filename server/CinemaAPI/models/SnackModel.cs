using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CinemaAPI.Models
{
    public enum SnackType
    {
        Food = 0,
        Drink = 1,
        Combo = 2
    }

    public class Snack
    {
        [Key]
        public int snack_id { get; set; }

        [JsonIgnore]
        public virtual ICollection<BookingSnacks> BookingSnacks { get; set; } = new List<BookingSnacks>();
        [JsonIgnore]
        public virtual ICollection<ComboDetail> ComboDetails { get; set; } = new List<ComboDetail>();
        [JsonIgnore]
        public virtual ICollection<Inventory> Inventory { get; set; } = new List<Inventory>();

        [Required]
        public string name { get; set; } = null!;

        [Required]
        public SnackType type { get; set; }

        [Required]
        public decimal price { get; set; }

        public string? imageUrl { get; set; }
    }
}