namespace CinemaAPI.Models.DTOs
{
    public class AuthResponse
    {
        public Guid user_id { get; set; }
        public string userName { get; set; } = null!;
        public string email { get; set; } = null!;
        public string role { get; set; } = null!;
        public DateTime birthDate { get; set;}
        public string token { get; set; } = null!;
        public DateTime expiresAt { get; set; }
    }
}