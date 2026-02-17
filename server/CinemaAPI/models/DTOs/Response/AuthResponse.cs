namespace CinemaAPI.Models.DTOs
{
    public record LoginRequest(string userName, string password);
    public record RegisterRequest(string userName, string email, string password, string role, DateTime birthDate);
    public record VerifyEmailRequest(string email, string verificationToken);
    public record ResetPassRequest(string email, string newPassword);
    public record CheckPasswordResetRequest(string email, string resetToken);
    public record ForgotPasswordRequest(string email);

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