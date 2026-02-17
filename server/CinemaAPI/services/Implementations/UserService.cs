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

        public async Task<List<User>> GetAllUsers() =>
            await _dbContext.Users.ToListAsync();

        public async Task<User?> GetUserById(Guid userId) =>
            await _dbContext.Users.FirstOrDefaultAsync(u => u.user_id == userId);

        public async Task BannedUser(Guid userId, bool isBanned)
        {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.user_id == userId);

                if (user != null)
                {
                    user.isBanned = isBanned;
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"DeleteUser Error: {ex.Message}");
                throw new Exception($"An error occurred while deleting the user. {ex.Message}");
            }
        }
    }
}