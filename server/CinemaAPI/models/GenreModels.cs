using System.ComponentModel.DataAnnotations;

namespace CinemaAPI.Models
{
    public class Genre
    {
        [Key]
        public int genre_id { get; set; }

        public virtual ICollection<MovieGenre> MovieGenres { get; set; } = new List<MovieGenre>();

        [Required, MaxLength(100)]
        public string name { get; set; } = null!;
    }
}