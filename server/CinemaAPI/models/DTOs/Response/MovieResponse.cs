using System.Text.Json.Serialization;
namespace CinemaAPI.Models.DTOs
{
    public class MovieResponse
    {
        public List<MovieItem> Results { get; set; } = new();
    }

    public class MovieItem
    {
        public int Id { get; set; }
        public bool adult { get; set; }
        public string backdrop_path { get; set; } = null!;
        public string poster_path { get; set; } = null!;
        public List<int> genre_ids { get; set; } = new();
        public string title { get; set; } = null!;
        public string overview { get; set; } = null!;
        [JsonConverter(typeof(TmdbService.NullableDateTimeConverter))]
        public DateTime? release_date { get; set; }
        public double vote_average { get; set; }
        public int vote_count { get; set; }
    }
}