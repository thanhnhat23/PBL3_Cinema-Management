namespace CinemaAPI.Models.DTOs
{
    public class MovieRequest
    {
        public string? tmdb_id { get; set; }
        public bool? adult { get; set; }
        public string title { get; set; } = null!;
        public string overview { get; set; } = null!;
        public DateTime release_date { get; set; }
        public DateTime end_date { get; set; }
        public string backdrop_path { get; set; } = null!;
        public string poster_path { get; set; } = null!;
        public double vote_average { get; set; }
        public int vote_count { get; set; }
        public string? trailer_url { get; set; }
        public int runtime { get; set; }
        public MovieStatus status { get; set; }
    }

    public class MovieUpdateRequest
    {
        public string? title { get; set; }
        public string? overview { get; set; }
        public DateTime? release_date { get; set; }
        public DateTime? end_date { get; set; }
        public MovieStatus? status { get; set; }
    }
}