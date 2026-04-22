using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class inventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public inventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllInventories()
        {
            try
            {
                var inventories = await _inventoryService.GetAllInventories();
                return Ok(inventories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in inventoryController.GetAllInventories: {ex.Message}");
            }
        }

        [HttpGet("get/{cinemaId}/{snackId}")]
        public async Task<IActionResult> GetInventory(int cinemaId, int snackId)
        {
            try
            {
                var inventory = await _inventoryService.GetInventoryById(cinemaId, snackId);
                if (inventory == null)
                    return NotFound("Inventory not found");

                return Ok(inventory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in inventoryController.GetInventory: {ex.Message}");
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateInventory([FromBody] InventoryRequest request)
        {
            try
            {
                var inventory = new Inventory
                {
                    cinema_id = request.cinema_id,
                    snack_id = request.snack_id,
                    quantity = request.quantity
                };

                await _inventoryService.AddInventory(inventory);
                return Ok("Inventory created successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in inventoryController.CreateInventory: {ex.Message}");
            }
        }


        [HttpPut("update/{cinemaId}/{snackId}")]
        public async Task<IActionResult> UpdateInventory(int cinemaId, int snackId, [FromBody] InventoryUpdateRequest request)
        {
            try
            {
                await _inventoryService.UpdateInventory(cinemaId, snackId, request);
                return Ok("Inventory updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in inventoryController.UpdateInventory: {ex.Message}");
            }
        }

    }
}