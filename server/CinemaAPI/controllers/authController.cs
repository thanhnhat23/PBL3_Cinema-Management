using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class authController : ControllerBase
    {
        private readonly IAuthService _authService;

        public authController(IAuthService authService)
        {
            _authService = authService;
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

        [HttpPost("forgot-password")]
        public async Task<IActionResult> Post([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                var response = await _authService.ForgotPasswordAsync(request.email);
                if (!response)
                    return BadRequest(new { Message = "Failed to process forgot password request. Please check your email." });

                return Ok(new { Message = "If the email is registered, a reset token has been sent." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in authController.ForgotPassword: {ex.Message}");
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> Post([FromBody] ResetPassRequest request)
        {
            try
            {
                var response = await _authService.ResetPasswordAsync(request);
                if (!response)
                    return BadRequest(new { Message = "Failed to reset password. Please check your email." });

                return Ok(new { Message = "Password reset successful. Please check your email for the new password." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in authController.ResetPassword: {ex.Message}");
            }
        }
    }
}