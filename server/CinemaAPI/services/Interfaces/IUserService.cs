using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IUserService
    {
        Task<List<User>> GetAllUsers();
        Task<User?> GetUserById(Guid user_id);
        Task BannedUser(Guid user_id, bool isBanned);
        
    }
}