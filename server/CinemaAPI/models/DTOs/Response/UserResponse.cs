namespace CinemaAPI.Models.DTOs
{
    public class UserResponse
    {
        public Guid user_id { get; set; }
        public string userName { get; set; }
        public string email { get; set; }
        public DateTime birthDate { get; set; }
        public bool isBanned { get; set; }
        public UserType role { get; set; }
        public DateTime createAt{ get; set; }
        public bool isEmailVerified{ get; set; }
    }
}