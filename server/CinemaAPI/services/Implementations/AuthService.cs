using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace CinemaAPI.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _dbContext;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;

        public AuthService(AppDbContext dbContext, IConfiguration config, IEmailService emailService)
        {
            _dbContext = dbContext;
            _config = config;
            _emailService = emailService;
        }

        public async Task<AuthResponse?> LoginAsync(LoginRequest request)
        {
            try
            {
                var user = _dbContext.Users.FirstOrDefault(u => u.email == request.email);

                // Verify password
                if (user == null || !BCrypt.Net.BCrypt.Verify(request.password, user.passwordHash))
                    return null; // Invalid credentials

                // Check verification email
                if (!user.isEmailVerified)
                    throw new Exception("Email not verified. Please verify your email before logging in.");

                var token = GenerateJwtToken(user);

                return new AuthResponse
                {
                    user_id = user.user_id,
                    userName = user.userName,
                    email = user.email,
                    birthDate = user.birthDate,
                    role = user.role.ToString(),
                    token = token,
                    expiresAt = DateTime.UtcNow.AddDays(3)
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"LoginAsync Error: {ex.Message}");
                throw new Exception($"An error occurred during login. {ex.Message}");
            }
        }

        public async Task<bool> LogoutAsync(string token)
        {
            try
            {
                if (string.IsNullOrEmpty(token)) return false;

                _dbContext.BlacklistedTokens.Add(new BlacklistedToken
                {
                    Token = token,
                    ExpiryDate = DateTime.UtcNow.AddDays(3)
                });

                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"LogoutAsync Error: {ex.Message}");
                throw new Exception($"An error occurred during logout. {ex.Message}");
            }
        }

        public async Task<bool> RegisterAsync(RegisterRequest request, UserType? role)
        {
            try
            {
                var existingUser = await _dbContext.Users.AnyAsync(u => u.email == request.email);
                var address = new System.Net.Mail.MailAddress(request.email);

                if (existingUser)
                    throw new Exception("User already exists"); // User already exists
                if (address.Address != request.email)
                    throw new Exception("Invalid email format"); // Invalid email format

                var token = new Random().Next(100000, 999999).ToString();

                var user = new User
                {
                    userName = request.userName,
                    email = request.email,
                    passwordHash = BCrypt.Net.BCrypt.HashPassword(request.password),
                    role = role ?? UserType.User,
                    birthDate = request.birthDate,
                    isEmailVerified = false,
                    verificationToken = token,
                    verificationTokenExpires = DateTime.UtcNow.AddMinutes(5)
                };

                _dbContext.Users.Add(user);
                await _dbContext.SaveChangesAsync();

                if (role != UserType.Admin && role != UserType.Staff)
                {
                    user.isEmailVerified = true;
                    await _emailService.SendVerificationEmailAsync(user.email, token);
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"RegisterAsync Error: {ex.Message}");
                throw new Exception($"An error occurred during registration. {ex.Message}");
            }
        }

        public async Task<bool> VerifyEmailAsync(VerifyEmailRequest request) {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(u =>
                    u.email == request.email &&
                    u.verificationToken == request.verificationToken &&
                    u.verificationTokenExpires > DateTime.UtcNow);

                if (user == null)
                    return false; // Invalid token or email
                if (user.verificationTokenExpires < DateTime.UtcNow)
                    return false; // Token expired
                
                user.isEmailVerified = true;
                user.verificationToken = null;
                user.verificationTokenExpires = null;

                await _dbContext.SaveChangesAsync();
                return true;
            } catch (Exception ex) {
                Console.WriteLine($"VerifyEmailAsync Error: {ex.Message}");
                throw new Exception($"An error occurred during email verification. {ex.Message}");
            }
        }

        public async Task<bool> ForgotPasswordAsync(ForgotPasswordRequest request)
        {
            try
            {
                var user = _dbContext.Users.FirstOrDefault(u => u.email == request.email);
                if (user == null) return false;

                var token = new Random().Next(100000, 999999).ToString();
                // Ensure token is unique
                var existingToken = await _dbContext.Users.AnyAsync(u => u.passwordResetToken == token);
                if (existingToken)
                {
                    token = new Random().Next(100000, 999999).ToString();
                }
                user.passwordResetToken = token;
                user.resetTokenExpires = DateTime.UtcNow.AddMinutes(5);

                await _dbContext.SaveChangesAsync();

                // Send reset password email
                await _emailService.SendResetPasswordEmailAsync(user.email, token);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ForgotPasswordAsync Error: {ex.Message}");
                throw new Exception($"An error occurred during forgot password process. {ex.Message}");
            }
        }

        public async Task<bool> ResetPasswordAsync(ResetPassRequest request)
        {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(u =>
                    u.email == request.email &&
                    u.passwordResetToken == request.resetToken &&
                    u.resetTokenExpires > DateTime.UtcNow);

                if (user == null)
                    return false; // Invalid token or email
                if (user.resetTokenExpires > DateTime.UtcNow)
                    return false; // Token expired

                // Update password and clear reset token
                user.passwordHash = BCrypt.Net.BCrypt.HashPassword(request.newPassword);
                user.passwordResetToken = null;
                user.resetTokenExpires = null;

                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ResetPasswordAsync Error: {ex.Message}");
                throw new Exception($"An error occurred during password reset. {ex.Message}");
            }
        }

        public string GenerateJwtToken(User user)
        {
            try
            {
                var claims = new List<Claim>
                {
                    new Claim("user_id", user.user_id.ToString()),
                    new Claim("userName", user.userName),
                    new Claim("email", user.email),
                    new Claim("role", user.role.ToString())
                };

                var jwtKey = _config["Jwt:Key"];
                var issuer = _config["Jwt:Issuer"];
                var audience = _config["Jwt:Audience"];

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: issuer,
                    audience: audience,
                    claims: claims,
                    expires: DateTime.UtcNow.AddDays(3),
                    signingCredentials: creds
                );

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GenerateJwtToken Error: {ex.Message}");
                throw new Exception($"An error occurred while generating JWT token. {ex.Message}");
            }
        }
    }
}