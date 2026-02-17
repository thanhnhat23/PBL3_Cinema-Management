namespace CinemaAPI.Models.DTOs
{
    public class GenreResponse
    {
        public List<GenreItem> Genres { get; set; } = new();
    }

    public class GenreItem
    {
        public int Id { get; set; }
        public string name { get; set;} = null!;
    }

    public class GenreCreateRequest
    {
        public string name { get; set;} = null!;
    }

    public class GenreUpdateRequest
    {
        public string? name { get; set;} = null;
    }
}