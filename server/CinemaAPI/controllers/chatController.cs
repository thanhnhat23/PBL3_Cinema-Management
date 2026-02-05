using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CinemaAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class chatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public chatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost("message")]
        public async Task<IActionResult> SendMessage([FromBody] ChatRequest request)
        {
            try
            {
                // Get user_id from JWT token
                var userId = User.FindFirst("user_id")?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Message = "User not authenticated" });

                if (string.IsNullOrWhiteSpace(request.message))
                    return BadRequest(new { Message = "Message cannot be empty" });

                var response = await _chatService.ProcessChatAsync(userId, request.message);

                return Ok(new
                {
                    Message = "Chat processed successfully",
                    Data = response
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "An error occurred while processing chat",
                    Error = ex.Message
                });
            }
        }
    }
}
