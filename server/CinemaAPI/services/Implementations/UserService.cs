using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _dbContext;

        public UserService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Get all users
        public async Task<List<User>> GetAllUsers() =>
            await _dbContext.Users.AsNoTracking().ToListAsync();

        // Get user by ID
        public async Task<User?> GetUserById(Guid user_id) =>
            await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.user_id == user_id);

        // Ban or unban user
        public async Task BannedUser(Guid user_id, bool isBanned)
        {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.user_id == user_id);
                if (user == null)
                    throw new KeyNotFoundException("User not found");

                user.isBanned = isBanned;
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error banning/unbanning user: {ex.Message}");
                throw new ApplicationException("An error occurred while updating the user's ban status.", ex);
            }
        }
    }
}