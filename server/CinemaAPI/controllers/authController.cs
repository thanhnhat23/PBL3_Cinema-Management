using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class authController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;

        public authController(IAuthService authService, IUserService userService)
        {
            _authService = authService;
            _userService = userService;
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                              ?? User.FindFirst("user_id")?.Value;
            if (string.IsNullOrWhiteSpace(userIdValue))
            {
                return Unauthorized(new { Message = "Invalid token claims." });
            }

            var user = await _userService.GetUserById(Guid.Parse(userIdValue));
            return Ok(new { user });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Post([FromBody] LoginRequest request)
        {
            try
            {
                var response = await _authService.LoginAsync(request);
                if (response == null)
                    return Unauthorized(new { Message = "Email or password is incorrect." });

                return Ok(new { Message = "Login successful.", Data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in authController.Login: {ex.Message}");
            }
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var success = await _authService.LogoutAsync(token);

                return success ? Ok(new { Message = "Successfully logged out." })
                               : BadRequest(new { Message = "Logout failed." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in authController.Logout: {ex.Message}");
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Post([FromBody] RegisterRequest request)
        {
            try
            {
                UserType? role = null;
                if (!string.IsNullOrWhiteSpace(request.role)
                    && Enum.TryParse<UserType>(request.role, true, out var parsedRole)
                    && Enum.IsDefined(typeof(UserType), parsedRole))
                {
                    role = parsedRole;
                }

                var response = await _authService.RegisterAsync(request, role);
                if (!response)
                    return BadRequest(new { Message = "Email is already in use." });

                return Ok(new { Message = "Registration successful." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in authController.Register: {ex.Message}");
            }
        }

        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmailGet([FromQuery] string token)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(token))
                    return BadRequest(new { Message = "Verification token is required." });

                var request = new VerifyEmailRequest(token);
                var response = await _authService.VerifyEmailAsync(request);

                if (!response)
                    return BadRequest(new { Message = "Email verification failed. The token may be invalid or expired." });

                return Ok(new { Message = "Email verified successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = ex.Message });
            }
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> Post([FromBody] VerifyEmailRequest request)
        {
            try
            {
                var response = await _authService.VerifyEmailAsync(request);
                if (!response)
                    return BadRequest(new { Message = "Email verification failed. The token may be invalid or expired." });

                return Ok(new { Message = "Email verified successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in authController.VerifyEmail: {ex.Message}");
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> Post([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                var response = await _authService.ForgotPasswordAsync(request);
                if (!response)
                    return BadRequest(new { Message = "Failed to process forgot password request. Please check your email." });

                return Ok(new { Message = "Check your email for the reset password." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in authController.ForgotPassword: {ex.Message}");
            }
        }

        [HttpPost("check-reset-password")]
        public async Task<IActionResult> CheckResetPassword([FromBody] CheckPasswordResetRequest request)
        {
            try
            {
                var response = await _authService.CheckResetPasswordAsync(request);
                if (!response)
                    return BadRequest(new { Message = "Invalid or expired reset token." });

                return Ok(new { Message = "Valid reset token." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in authController.CheckResetPassword: {ex.Message}");
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> Post([FromBody] ResetPassRequest request)
        {
            try
            {
                var response = await _authService.ResetPasswordAsync(request);
                if (!response)
                    return BadRequest(new { Message = "Failed to reset password. The reset token may be invalid or expired." });

                return Ok(new { Message = "Password reset successful. You can now log in with your new password." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in authController.ResetPassword: {ex.Message}");
            }
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                var userId = GetUserIdFromToken();
                var response = await _authService.ChangePasswordAsync(request, userId);
                if (!response)
                    return BadRequest(new { Message = "Failed to change password. Please check your current password." });

                return Ok(new { Message = "Password changed successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in authController.ChangePassword: {ex.Message}");
            }
        }

        [HttpPost("change-email")]
        public async Task<IActionResult> ChangeEmail([FromBody] ChangeEmailRequest request)
        {
            try
            {
                var userId = GetUserIdFromToken();
                var response = await _authService.ChangeEmailAsync(request, userId);
                if (!response)
                    return BadRequest(new { Message = "Failed to change email. Please check your password and new email." });

                return Ok(new { Message = "Email changed successfully. Please verify your new email address." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in authController.ChangeEmail: {ex.Message}");
            }
        }

        [HttpPost("change-birthdate")]
        public async Task<IActionResult> ChangeBirthday([FromBody] ChangeBirthdayRequest request)
        {
            try
            {
                var userId = GetUserIdFromToken();
                var response = await _authService.ChangeBirthdayAsync(request, userId);
                if (!response)
                    return BadRequest(new { Message = "Failed to change birthday. Please check your password and new birthday." });

                return Ok(new { Message = "Birthday changed successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in authController.ChangeBirthday: {ex.Message}");
            }
        }

        [Authorize]
        [HttpPost("upload-avatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { Message = "Avatar file is required." });
            }

            var userId = GetUserIdFromToken();
            var url = await _authService.UploadUserAvatar(userId, file);
            if (url == null) return BadRequest("Upload failed or user not found.");
            return Ok(new { avatarUrl = url });
        }

        // Helper method to extract user_id from JWT token
        private Guid GetUserIdFromToken()
        {
            var userIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                              ?? User.FindFirst("user_id")?.Value;
            if (string.IsNullOrWhiteSpace(userIdValue))
                throw new Exception("Invalid token claims.");
            return Guid.Parse(userIdValue);
        }
    }
}