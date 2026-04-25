using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Implementations;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class combodetailController : ControllerBase
    {
        private readonly IComboDetail combodetailService;
        private readonly ComboDetailService comboDetailDeleteService;
        public combodetailController(IComboDetail combodetailService, ComboDetailService comboDetailDeleteService)
        {
            this.combodetailService = combodetailService;
            this.comboDetailDeleteService = comboDetailDeleteService;
        }
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllComboDetails()
        {
            try
            {
                var comboDetails = await combodetailService.GetAllComboDetails();
                return Ok(comboDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in combodetailController.GetAllComboDetails: {ex.Message}");
            }
        }
        [HttpGet("get/{combo_id}")]
        public async Task<IActionResult> GetComboDetailsByCombo(int combo_id)
        {
            try
            {
                var comboDetails = await combodetailService.GetComboDetailsByComboId(combo_id);
                if (comboDetails.Count == 0)
                    return NotFound("Combo detail not found");

                return Ok(comboDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in combodetailController.GetComboDetailsByCombo: {ex.Message}");
            }
        }

        [HttpGet("get/{combo_id}/{snack_id}")]
        public async Task<IActionResult> GetComboDetail(int combo_id, int snack_id)
        {
            try
            {
                var comboDetail = await combodetailService.GetComboDetail(combo_id, snack_id);
                if (comboDetail == null)
                    return NotFound("Combo detail not found");

                return Ok(comboDetail);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in combodetailController.GetComboDetail: {ex.Message}");
            }
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateComboDetail([FromBody] ComboDetailCreateRequest request)
        {
            try
            {
                var comboDetail = new ComboDetail
                {
                    combo_id = request.combo_id,
                    snack_id = request.snack_id,
                    quantity = request.quantity
                };
                await combodetailService.AddComboDetail(comboDetail);
                return Ok("Combo detail created successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in combodetailController.CreateComboDetail: {ex.Message}");
            }
        }
        
        [HttpPut("update/{combo_id}/{snack_id}")]
        public async Task<IActionResult> UpdateComboDetail(int combo_id, int snack_id, [FromBody] ComboDetailUpdateRequest request)
        {
            try
            {
                await combodetailService.UpdateComboDetail(combo_id, snack_id, request);
                return Ok("Combo detail updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in combodetailController.UpdateComboDetail: {ex.Message}");
            }
        }

        [HttpDelete("delete/{combo_id}/{snack_id}")]
        public async Task<IActionResult> DeleteComboDetail(int combo_id, int snack_id)
        {
            try
            {
                await comboDetailDeleteService.SoftDeleteComboDetail(combo_id, snack_id);
                return Ok("Combo detail deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in combodetailController.DeleteComboDetail: {ex.Message}");
            }
        }

        [HttpDelete("hard-delete/{combo_id}/{snack_id}")]
        public async Task<IActionResult> HardDeleteComboDetail(int combo_id, int snack_id)
        {
            try
            {
                await comboDetailDeleteService.HardDeleteComboDetail(combo_id, snack_id);
                return Ok("Combo detail hard deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in combodetailController.HardDeleteComboDetail: {ex.Message}");
            }
        }
    }
}