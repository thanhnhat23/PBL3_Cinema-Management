using System.ComponentModel.DataAnnotations;

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

        public virtual ICollection<BookingSnacks> BookingSnacks { get; set; } = new List<BookingSnacks>();

        [Required]
        public string name { get; set; } = null!;
        
        [Required]
        public SnackType type { get; set; }

        [Required]
        public int stockQuantity { get; set; }

        [Required]
        public decimal price { get; set; }

        public string? imageUrl { get; set; }
    }
}