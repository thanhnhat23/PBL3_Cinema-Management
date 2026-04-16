using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class actorController : ControllerBase
    {
        private readonly IActorService _actorService;

        public actorController(IActorService actorService)
        {
            _actorService = actorService;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllActors()
        {
            try
            {
                var actors = await _actorService.GetAllActorsAsync();
                return Ok(actors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in actorController.GetAllActors: {ex.Message}");
            }
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetActorById(int id)
        {
            try
            {
                var actor = await _actorService.GetActorByIdAsync(id);
                if (actor == null)
                    return NotFound("Actor not found");

                return Ok(actor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in actorController.GetActorById: {ex.Message}");
            }
        }

        [HttpGet("get-movie-with-actors/{id}")]
        public async Task<IActionResult> GetMovieWithActor(int id)
        {
            try
            {
                var actor = await _actorService.GetMovieWithActorAsync(id);
                if (actor == null)
                    return NotFound("Actor not found on movie");

                return Ok(actor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in actorController.GetMovieWithActor: {ex.Message}");
            }
        }

        [HttpGet("get-character-with-actors/{id}")]
        public async Task<IActionResult> GetCharacterWithActor(int id)
        {
            try
            {
                var actor = await _actorService.GetCharacterWithActorAsync(id);
                if (actor == null)
                    return NotFound("Actor not found on character");

                return Ok(actor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in actorController.GetCharacterWithActor: {ex.Message}");
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateActor(int id, [FromBody] ActorDetailRequest request)
        {
            try
            {
                await _actorService.UpdateActorAsync(id, request);
                return Ok("Actor updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in actorController.UpdateActor: {ex.Message}");
            }
        }
    }
}