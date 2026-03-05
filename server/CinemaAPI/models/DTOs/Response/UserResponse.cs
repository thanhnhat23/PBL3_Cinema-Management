namespace CinemaAPI.Models.DTOs
{
    public class UserResponse
    {
        public string userName { get; set; } = null!;
        public string email { get; set; } = null!;
        public DateTime birthDate { get; set; }
        public int age { get; set; }
        public UserType role { get; set; }
        public DateTime createAt { get; set; }
        public bool isEmailVerified { get; set; }
        public bool isBanned { get; set; }
    }
}
