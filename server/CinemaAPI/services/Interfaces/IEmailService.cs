using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendResetPasswordEmailAsync(string email, string resetToken);
        Task SendEmailVerificationAsync(string email, string verificationToken);
    }
}