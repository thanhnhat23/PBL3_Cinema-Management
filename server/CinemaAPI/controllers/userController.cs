using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class userController : ControllerBase
    {
        private readonly IUserService _userService;

        public userController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsers();
                var response = users.Select(u => new UserResponse
                {
                    user_id = u.user_id,
                    userName = u.userName,
                    email = u.email,
                    birthDate = u.birthDate,
                    age = u.age,
                    role = u.role,
                    createAt = u.createAt,
                    isEmailVerified = u.isEmailVerified,
                    isBanned = u.isBanned
                });
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in userController.GetAllUsers: {ex.Message}");
            }
        }

        [HttpGet("get/{userId}")]
        public async Task<IActionResult> GetUserById(Guid userId)
        {
            try
            {
                var user = await _userService.GetUserById(userId);
                if (user == null)
                {
                    return NotFound();
                }
                var response = new UserResponse
                {
                    user_id = user.user_id,
                    userName = user.userName,
                    email = user.email,
                    birthDate = user.birthDate,
                    age = user.age,
                    role = user.role,
                    createAt = user.createAt,
                    isEmailVerified = user.isEmailVerified
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in userController.GetUserById: {ex.Message}");
            }
        }

        [HttpPut("banned/{userId}")]
        public async Task<IActionResult> BannedUser(Guid userId, bool isBanned)
        {
            try
            {
                await _userService.BannedUser(userId, isBanned);
                return Ok($"User {userId} banned status updated to {isBanned}.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in userController.BannedUser: {ex.Message}");
            }
        }
    }
}
