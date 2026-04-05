using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IInventoryService
    {
        Task<List<Inventory>> GetAllInventories();
        Task<Inventory?> GetInventoryById(int cinema_id, int snack_id);
        Task AddInventory(Inventory inventory);
        Task UpdateInventory(int cinema_id, int snack_id, InventoryUpdateRequest request);
        Task DeleteInventory(int cinema_id, int snack_id);
    }
}