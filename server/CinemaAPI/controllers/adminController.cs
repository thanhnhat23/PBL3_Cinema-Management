using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // localhost:5143/api/admin/sync-genres
    public class adminController : ControllerBase
    {
        private readonly ITmdbService _tmdbService;
        private readonly IRoomService _roomService;

        public adminController(ITmdbService tmdbService, IRoomService roomService)
        {
            _tmdbService = tmdbService;
            _roomService = roomService;
        }

        [HttpPost("sync-genres")]
        public async Task<IActionResult> SeedGenres()
        {
            try
            {
                await _tmdbService.ISyncGenresAsync();
                return Ok("Genres synchronized successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost("sync-movies")]
        public async Task<IActionResult> SyncMovie([FromQuery] string type = "now_playing")
        {
            if (type != "now_playing" && type != "upcoming" && type != "popular")
            {
                return BadRequest("Invalid type. Allowed values are 'now_playing', 'upcoming', or 'popular'.");
            }

            try
            {
                await _tmdbService.SyncMovieAsync(type);
                return Ok("Movies synchronized successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost("create-rooms")]
        public async Task<IActionResult> CreateRoom([FromBody] RoomCreateRequest request)
        {
            try
            {
                var room = new Room
                {
                    cinema_id = request.cinema_id,
                    nameRoom = request.nameRoom,
                    roomLayoutType = request.roomLayoutType,
                    price = request.price
                };

                await _roomService.AddRoom(room, request.rows, request.cols);
                return Ok("Room created successfully.");
                
            } catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPut("update-rooms/{roomId}")]
        public async Task<IActionResult> UpdateRoom(int roomId, [FromBody] Room updateRoom)
        {
            try
            {
                await _roomService.UpdateRoom(roomId, updateRoom);
                return Ok("Room updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpDelete("delete-rooms/{roomId}")]
        public async Task<IActionResult> DeleteRoom(int roomId)
        {
            try
            {
                await _roomService.DeleteRoom(roomId);
                return Ok("Room deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}