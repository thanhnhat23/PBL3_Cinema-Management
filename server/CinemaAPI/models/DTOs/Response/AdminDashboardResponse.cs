namespace CinemaAPI.Models.DTOs
{
    public class MovieStatusCountResponse
    {
        public string status { get; set; } = null!;
        public int total { get; set; }
    }

    public class MovieMonthlyCountResponse
    {
        public int month { get; set; }
        public string monthName { get; set; } = null!;
        public int total { get; set; }
    }

    public class MovieGenreCountResponse
    {
        public int genreId { get; set; }
        public string genre { get; set; } = null!;
        public int movie { get; set; }
    }
}