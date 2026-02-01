namespace CinemaAPI.Models.DTOs
{
    public class MovieDetailResponse
    {
        public int runtime { get; set; } = 0;
        public List<MovieTrailer>? results { get; set; }
    }

    public class MovieTrailer
    {
        public string key { get; set;} = null!;
        public string type { get; set; } = null!;
        public string site { get; set; } = null!;
    }
}