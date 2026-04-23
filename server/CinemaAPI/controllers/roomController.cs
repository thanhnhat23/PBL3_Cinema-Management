using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Implementations;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class roomController : ControllerBase
    {
        private readonly IRoomService _roomService;
        private readonly RoomService _roomDeleteService;

        public roomController(IRoomService roomService, RoomService roomDeleteService)
        {
            _roomService = roomService;
            _roomDeleteService = roomDeleteService;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllRooms()
        {
            try
            {
                var rooms = await _roomService.GetAllRooms();
                return Ok(rooms);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in roomController.GetAllRooms: {ex.Message}");
            }
        }

        [HttpGet("get/{roomId}")]
        public async Task<IActionResult> GetRoom(int roomId)
        {
            try
            {
                var room = await _roomService.GetRoomById(roomId);
                if (room == null)
                    return NotFound("Room not found");

                return Ok(room);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in roomController.GetRoom: {ex.Message}");
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateRoom([FromBody] RoomCreateRequest request)
        {
            try
            {
                var room = new Room
                {
                    cinema_id = request.cinema_id,
                    nameRoom = request.nameRoom,
                    roomLayoutType = request.roomLayoutType,
                    price = request.price,
                    row = request.row,
                    column = request.column
                };

                await _roomService.AddRoom(room);
                return Ok("Room created successfully.");

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in roomController.CreateRoom: {ex.Message}");
            }
        }

        [HttpPut("update/{roomId}")]
        public async Task<IActionResult> UpdateRoom(int roomId, [FromBody] RoomUpdateRequest updateRoom)
        {
            try
            {
                await _roomService.UpdateRoom(roomId, updateRoom);
                return Ok("Room updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in roomController.UpdateRoom: {ex.Message}");
            }
        }

        [HttpDelete("delete/{roomId}")]
        public async Task<IActionResult> DeleteRoom(int roomId)
        {
            try
            {
                await _roomDeleteService.SoftDeleteRoom(roomId);
                return Ok("Room deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in roomController.DeleteRoom: {ex.Message}");
            }
        }

        [HttpDelete("hard-delete/{roomId}")]
        public async Task<IActionResult> HardDeleteRoom(int roomId)
        {
            try
            {
                await _roomDeleteService.HardDeleteRoom(roomId);
                return Ok("Room hard deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in roomController.HardDeleteRoom: {ex.Message}");
            }
        }
    }
}