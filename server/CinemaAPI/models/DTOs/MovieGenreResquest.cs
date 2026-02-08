namespace CinemaAPI.Models.DTOs
{
    public class MovieGenreCreateRequest
    {
        public int movie_id { get; set; }
        public int genre_id { get; set; }
    }

    public class MovieGenreUpdateRequest
    {
        public int? movie_id { get; set; }
        public int? genre_id { get; set; }
    }
}