using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CinemaAPI.Models
{
    public enum MovieStatus
    {
        Released = 0,
        Upcoming = 1,
        Ended = 2
    }

    public class Movie
    {
        [Key]
        public int movie_id { get; set; }

        public virtual ICollection<ShowTime> ShowTimes { get; set; } = new List<ShowTime>();
        public virtual ICollection<MovieGenre> MovieGenres { get; set; } = new List<MovieGenre>();
        public virtual ICollection<MovieActor> MovieActors { get; set; } = new List<MovieActor>();

        public string? tmdb_id { get; set; }

        public bool? adult { get; set; }

        [Required]
        public string title { get; set; } = null!;

        [Required]
        public string overview { get; set; } = null!;
        
        public DateTime release_date { get; set; }
        public DateTime end_date { get; set; }

        [MaxLength(500)]
        public string backdrop_path { get; set; } = null!;

        [MaxLength(500)]
        public string poster_path { get; set; } = null!;

        [Required]
        public double vote_average { get; set; }

        [Required]
        public int vote_count { get; set; }

        public MovieStatus status { get; set; }
        
        [NotMapped]
        public MovieStatus current_status { 
            get
            {
                if (DateTime.UtcNow < release_date) return MovieStatus.Upcoming;
                if (DateTime.UtcNow > end_date) return MovieStatus.Ended;
                return MovieStatus.Released;
            }
        }
    }
}