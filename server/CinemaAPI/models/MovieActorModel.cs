using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaAPI.Models
{
    public class MovieActor
    {
        public int movie_id { get; set; }
        [ForeignKey("movie_id")]
        public virtual Movie Movie { get; set; } = null!;

        public int actor_id { get; set; }
        [ForeignKey("actor_id")]
        public virtual Actor Actor { get; set; } = null!;

        public string char_name { get; set; } = null!;
        public int order { get; set; } // Order of appearance in credits
    }
}