using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IComboDetail
    {
        Task<List<ComboDetail>> GetAllComboDetails();
        Task<ComboDetail?> GetComboDetailById(int combo_detail_id);
        Task AddComboDetail(ComboDetail comboDetail);
        Task UpdateComboDetail(int combo_detail_id, ComboDetailUpdateRequest request);
    }
}