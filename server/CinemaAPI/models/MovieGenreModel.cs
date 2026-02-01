using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaAPI.Models
{
    public class MovieGenre
    {
        public int movie_id { get; set; }
        [ForeignKey("movie_id")]
        public virtual Movie Movie { get; set; } = null!;

        public int genre_id { get; set; }
        [ForeignKey("genre_id")]
        public virtual Genre Genre { get; set; } = null!;
    }
}