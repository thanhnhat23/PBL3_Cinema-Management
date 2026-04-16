namespace CinemaAPI.Models.DTOs
{
    public record LoginRequest(string userName, string password);
    public record RegisterRequest(string userName, string email, string password, string role, DateTime birthDate);
    public record VerifyEmailRequest(string verificationToken);
    public record ResetPassRequest(string email, string newPassword);
    public record CheckPasswordResetRequest(string email, string resetToken);
    public record ForgotPasswordRequest(string email);
    public record ChangePasswordRequest(string currentPassword, string newPassword);
    public record ChangeEmailRequest(string currentEmail, string newEmail, string password);
    public record ChangeBirthdayRequest(DateTime newBirthDate);
}