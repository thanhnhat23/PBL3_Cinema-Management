namespace CinemaAPI.Models.DTOs
{
    public class ActorDetailResponse
    {
        public string? biography { get; set; } = null!;
        public DateOnly? birthday { get; set; } = null;
        public string? place_of_birth { get; set; } = null!;
    }

    public class ActorDetailUpdate
    {
        public string? biography { get; set; } = null!;
        public DateOnly? birthday { get; set; } = null;
        public string? place_of_birth { get; set; } = null!;
    }
}