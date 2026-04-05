using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class combodetailController : ControllerBase
    {
        private readonly IComboDetail combodetailService;
        public combodetailController(IComboDetail combodetailService)
        {
            this.combodetailService = combodetailService;
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
        [HttpGet("get/{combo_detail_id}")]
        public async Task<IActionResult> GetComboDetail(int combo_detail_id)
        {
            try
            {
                var comboDetail = await combodetailService.GetComboDetailById(combo_detail_id);
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
        [HttpPut("update/{combo_detail_id}")]
        public async Task<IActionResult> UpdateComboDetail(int combo_detail_id, [FromBody] ComboDetailUpdateRequest request)
        {
            try
            {
                await combodetailService.UpdateComboDetail(combo_detail_id, request);
                return Ok("Combo detail updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in combodetailController.UpdateComboDetail: {ex.Message}");
            }
        }
        [HttpDelete("delete/{combo_detail_id}")]
        public async Task<IActionResult> DeleteComboDetail(int combo_detail_id)
        {
            try
            {
                await combodetailService.DeleteComboDetail(combo_detail_id);
                return Ok("Combo detail deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in combodetailController.DeleteComboDetail: {ex.Message}");
            }
        }
    }
}