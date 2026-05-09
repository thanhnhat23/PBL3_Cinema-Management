using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class showtimePriceController : ControllerBase
    {
        private readonly IShowTimePriceService _service;

        public showtimePriceController(IShowTimePriceService service)
        {
            _service = service;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var items = await _service.GetAllPrices();
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpGet("get/{typeId}/{slotId}")]
        public async Task<IActionResult> Get(int typeId, int slotId)
        {
            try
            {
                var item = await _service.GetPrice(typeId, slotId);
                if (item == null) return NotFound();
                return Ok(item);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] ShowTimePriceCreateRequest req)
        {
            try
            {
                var p = new ShowTimePrice
                {
                    type_id = req.type_id,
                    slot_id = req.slot_id,
                    base_price = req.base_price
                };

                await _service.AddPrice(p);
                return Ok("Created");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPut("update/{typeId}/{slotId}")]
        public async Task<IActionResult> Update(int typeId, int slotId, [FromBody] ShowTimePriceUpdateRequest req)
        {
            try
            {
                await _service.UpdatePrice(typeId, slotId, req);
                return Ok("Updated");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpDelete("delete/{typeId}/{slotId}")]
        public async Task<IActionResult> Delete(int typeId, int slotId)
        {
            try
            {
                await _service.DeletePrice(typeId, slotId);
                return Ok("Deleted");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
}
