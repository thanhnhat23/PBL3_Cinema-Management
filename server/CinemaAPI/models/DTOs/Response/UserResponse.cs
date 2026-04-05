using CinemaAPI.Models;

namespace CinemaAPI.Models.DTOs
{
    public class UserResponse
    {
        public Guid user_id { get; set; }
        public string userName { get; set; } = null!;
        public string email { get; set; } = null!;
        public DateTime birthDate { get; set; }
        public int age { get; set; }
        public string? avatar_path { get; set; }
        public UserType role { get; set; }
        public DateTime createAt { get; set; }
        public bool isEmailVerified { get; set; }
        public bool isBanned { get; set; }
    }
}
