namespace CinemaAPI.Models.DTOs
{
    public class SnackCreateRequest
    {
        public string name { get; set; } = null!;
        public decimal price { get; set; }
        public SnackType type { get; set; }
        public string? imageUrl { get; set; }
    }

    public class SnackUpdateRequest
    {
        public string? name { get; set; }
        public decimal? price { get; set; }
        public SnackType? type { get; set; }
        public string? imageUrl { get; set; }
    }
} 