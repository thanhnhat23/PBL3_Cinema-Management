using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CinemaAPI.Models
{
    public class Location
    {
        [Key]
        public int location_id { get; set; }

        [JsonIgnore]
        public virtual ICollection<Cinema> Cinemas { get; set; } = new List<Cinema>();

        [Required, MaxLength(100)]
        public string city { get; set; } = null!;
        public DateTime? deleted_at { get; set; }
        public Guid? deleted_by { get; set; }
    }
}