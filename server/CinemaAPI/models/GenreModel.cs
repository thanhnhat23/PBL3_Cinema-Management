using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CinemaAPI.Models
{
    public class Genre
    {
        [Key]
        public int genre_id { get; set; }

        [JsonIgnore]
        public virtual ICollection<MovieGenre> MovieGenres { get; set; } = new List<MovieGenre>();

        [Required, MaxLength(100)]
        public string name { get; set; } = null!;
    }
}