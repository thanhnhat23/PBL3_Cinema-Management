using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IComboDetail
    {
        Task<List<ComboDetail>> GetAllComboDetails();
        Task<List<ComboDetail>> GetComboDetailsByComboId(int combo_id);
        Task<ComboDetail?> GetComboDetail(int combo_id, int snack_id);
        Task AddComboDetail(ComboDetail comboDetail);
        Task UpdateComboDetail(int combo_id, int snack_id, ComboDetailUpdateRequest request);
    }
}