using System.ComponentModel.DataAnnotations;

namespace CinemaAPI.Models
{
    public class Location
    {
        [Key]
        public int location_id { get; set; }

        public virtual ICollection<Cinema> Cinemas { get; set; } = new List<Cinema>();

        [Required, MaxLength(100)]
        public string city { get; set; } = null!;
    }
}