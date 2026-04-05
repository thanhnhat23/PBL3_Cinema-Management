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
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace CinemaAPI.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _dbContext;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;
        private readonly CloudinaryDotNet.Cloudinary _cloudinary;

        public AuthService(
            AppDbContext dbContext,
            IConfiguration config,
            IEmailService emailService,
            IOptions<CloudinaryConfig> cloudinaryOptions
        )
        {
            _dbContext = dbContext;
            _config = config;
            _emailService = emailService;

            var cloudinaryConfig = cloudinaryOptions.Value;
            var account = new Account(cloudinaryConfig.CloudName, cloudinaryConfig.ApiKey, cloudinaryConfig.ApiSecret);
            _cloudinary = new Cloudinary(account);
        }

        public async Task<AuthResponse?> LoginAsync(LoginRequest request)
        {
            try
            {
                var user = _dbContext.Users.FirstOrDefault(u => u.userName == request.userName);

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
                var existingEmail = await _dbContext.Users.AnyAsync(u => u.email == request.email);
                var existingUser = await _dbContext.Users.AnyAsync(u => u.userName == request.userName);
                var address = new System.Net.Mail.MailAddress(request.email);

                if (existingEmail)
                    throw new Exception("Email already exists"); // Email already exists
                if (existingUser)
                    throw new Exception("Username already exists"); // Username already exists
                if (address.Address != request.email)
                    throw new Exception("Invalid email format"); // Invalid email format

                // Generate a secure token for email verification link
                var token = Guid.NewGuid().ToString("N").Substring(0, 32);

                var user = new User
                {
                    userName = request.userName,
                    email = request.email,
                    passwordHash = BCrypt.Net.BCrypt.HashPassword(request.password),
                    role = role ?? UserType.User,
                    birthDate = request.birthDate,
                    isEmailVerified = (role == UserType.Admin || role == UserType.Staff),
                    verificationToken = (role != UserType.Admin && role != UserType.Staff) ? token : null,
                    verificationTokenExpires = (role != UserType.Admin && role != UserType.Staff) ? DateTime.UtcNow.AddMinutes(5) : null
                };

                _dbContext.Users.Add(user);
                await _dbContext.SaveChangesAsync();

                if (role != UserType.Admin && role != UserType.Staff)
                {
                    await _emailService.SendEmailVerificationAsync(user.email, token);
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"RegisterAsync Error: {ex.Message}");
                throw new Exception($"An error occurred during registration. {ex.Message}");
            }
        }

        public async Task<bool> VerifyEmailAsync(VerifyEmailRequest request)
        {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(u =>
                    u.verificationToken == request.verificationToken);

                if (user == null)
                    return false; // Invalid token or email

                // Check if token has expired
                if (user.verificationTokenExpires < DateTime.UtcNow)
                {
                    // Token expired - delete the user account to allow re-registration
                    _dbContext.Users.Remove(user);
                    await _dbContext.SaveChangesAsync();
                    throw new Exception("Verification token has expired. Please register again.");
                }

                user.isEmailVerified = true;
                user.verificationToken = null;
                user.verificationTokenExpires = null;

                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
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

        public async Task<bool> CheckResetPasswordAsync(CheckPasswordResetRequest request)
        {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(u =>
                    u.email == request.email &&
                    u.passwordResetToken == request.resetToken &&
                    u.resetTokenExpires > DateTime.UtcNow);

                if (user == null)
                    return false; // Invalid token or email
                if (user.resetTokenExpires < DateTime.UtcNow)
                    return false; // Token expired

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"CheckResetPasswordAsync Error: {ex.Message}");
                throw new Exception($"An error occurred during password reset check. {ex.Message}");
            }
        }

        public async Task<bool> ResetPasswordAsync(ResetPassRequest request)
        {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.email == request.email);

                if (user == null)
                    return false; // Invalid email

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

        public async Task<bool> ChangePasswordAsync(ChangePasswordRequest request, Guid userId)
        {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.user_id == userId);

                if (user == null)
                    return false; // User not found

                if (!BCrypt.Net.BCrypt.Verify(request.currentPassword, user.passwordHash))
                    throw new Exception("Current password is incorrect."); // Current password is incorrect

                user.passwordHash = BCrypt.Net.BCrypt.HashPassword(request.newPassword);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ChangePasswordAsync Error: {ex.Message}");
                throw new Exception($"An error occurred during password change. {ex.Message}");
            }
        }

        public async Task<bool> ChangeEmailAsync(ChangeEmailRequest request, Guid userId)
        {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.user_id == userId);

                if (user == null)
                    return false; // User not found

                if (user.email != request.currentEmail)
                    throw new Exception("Current email does not match."); // Current email does not match

                if (!BCrypt.Net.BCrypt.Verify(request.password, user.passwordHash))
                    throw new Exception("Password is incorrect."); // Password is incorrect

                var existingEmail = await _dbContext.Users.AnyAsync(u => u.email == request.newEmail);
                var address = new System.Net.Mail.MailAddress(request.newEmail);

                if (existingEmail)
                    throw new Exception("Email already exists"); // Email already exists
                if (address.Address != request.newEmail)
                    throw new Exception("Invalid email format"); // Invalid email format

                user.email = request.newEmail;
                user.isEmailVerified = false;

                // Generate a secure token for email verification link
                var token = Guid.NewGuid().ToString("N").Substring(0, 32);
                user.verificationToken = token;
                user.verificationTokenExpires = DateTime.UtcNow.AddMinutes(5);

                await _dbContext.SaveChangesAsync();

                await _emailService.SendEmailVerificationAsync(user.email, token);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ChangeEmailAsync Error: {ex.Message}");
                throw new Exception($"An error occurred during email change. {ex.Message}");
            }
        }

        public async Task<bool> ChangeBirthdayAsync(ChangeBirthdayRequest request, Guid userId)
        {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.user_id == userId);

                if (user == null)
                    return false; // User not found

                user.birthDate = request.newBirthDate;
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ChangeBirthdayAsync Error: {ex.Message}");
                throw new Exception($"An error occurred during birthday change. {ex.Message}");
            }
        }

        public async Task<string?> UploadUserAvatar(Guid userId, IFormFile file)
        {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.user_id == userId);
                if (user == null)
                    throw new Exception("User not found.");

                var previousAvatarPath = user.avatar_path;

                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(file.FileName, file.OpenReadStream()),
                    Folder = "cinema-management/avatars",
                    Transformation = new Transformation().Effect("sharpen:150").Width(1000).Crop("scale").Chain().Quality("auto").Chain().FetchFormat("auto")
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    if (!string.IsNullOrWhiteSpace(previousAvatarPath)
                        && TryExtractCloudinaryPublicId(previousAvatarPath, out var previousPublicId))
                    {
                        var deleteParams = new DeletionParams(previousPublicId)
                        {
                            Invalidate = true
                        };

                        await _cloudinary.DestroyAsync(deleteParams);
                    }

                    user.avatar_path = uploadResult.SecureUrl.ToString();
                    await _dbContext.SaveChangesAsync();
                    return user.avatar_path;
                }
                else
                {
                    throw new Exception("Failed to upload avatar.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"UploadUserAvatar Error: {ex.Message}");
                throw new Exception($"An error occurred while uploading the avatar. {ex.Message}");
            }
        }

        private static bool TryExtractCloudinaryPublicId(string url, out string publicId)
        {
            publicId = string.Empty;

            if (string.IsNullOrWhiteSpace(url))
            {
                return false;
            }

            if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
            {
                return false;
            }

            if (!uri.Host.Contains("res.cloudinary.com", StringComparison.OrdinalIgnoreCase))
            {
                return false;
            }

            var segments = uri.AbsolutePath
                .Trim('/')
                .Split('/', StringSplitOptions.RemoveEmptyEntries);

            var uploadIndex = Array.IndexOf(segments, "upload");
            if (uploadIndex < 0 || uploadIndex + 1 >= segments.Length)
            {
                return false;
            }

            var startIndex = uploadIndex + 1;
            if (segments[startIndex].Length > 1
                && segments[startIndex][0] == 'v'
                && int.TryParse(segments[startIndex][1..], out _))
            {
                startIndex++;
            }

            if (startIndex >= segments.Length)
            {
                return false;
            }

            var idParts = segments[startIndex..].ToArray();
            var lastPart = idParts[^1];
            var dotIndex = lastPart.LastIndexOf('.');
            if (dotIndex > 0)
            {
                idParts[^1] = lastPart[..dotIndex];
            }

            publicId = string.Join('/', idParts);
            return !string.IsNullOrWhiteSpace(publicId);
        }

        public string GenerateJwtToken(User user)
        {
            try
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.user_id.ToString()),
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