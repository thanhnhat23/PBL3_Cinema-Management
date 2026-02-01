using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse?> LoginAsync(LoginRequest request);
        Task<bool> LogoutAsync(string token);
        Task<bool> RegisterAsync(RegisterRequest request, UserType? role);
        Task<bool> ForgotPasswordAsync(string email);
        Task<bool> ResetPasswordAsync(ResetPassRequest request);
        string GenerateJwtToken(User user);
    }
}