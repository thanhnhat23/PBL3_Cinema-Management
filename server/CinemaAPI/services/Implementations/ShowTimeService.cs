using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class ShowTimeService : IShowTimeService
    {
        private readonly AppDbContext _dbContext;

        public ShowTimeService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<ShowTime>> GetAllShowTimes() =>
            await _dbContext.ShowTimes
                .Include(st => st.Movie)
                .Include(st => st.Room)
                .ToListAsync();

        public async Task<ShowTime?> GetShowTimeById(int show_time_id) =>
            await _dbContext.ShowTimes
                .Include(st => st.Movie)
                .Include(st => st.Room)
                .FirstOrDefaultAsync(st => st.show_time_id == show_time_id);

        public async Task AddShowTime(ShowTime showTime)
        {
            _dbContext.ShowTimes.Add(showTime);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateShowTime(int show_time_id, ShowTimeUpdateRequest request)
        {
            var showTime = await _dbContext.ShowTimes.FindAsync(show_time_id);

            if (showTime == null)
                throw new Exception("ShowTime not found");

            try
            {
                if (request.movie_id.HasValue)
                    showTime.movie_id = request.movie_id.Value;

                if (request.room_id.HasValue)
                    showTime.room_id = request.room_id.Value;

                if (request.start_time.HasValue)
                    showTime.start_time = request.start_time.Value;

                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating ShowTime: " + ex.Message);
            }
        }

        public async Task DeleteShowTime(int show_time_id)
        {
            var showTime = await _dbContext.ShowTimes.FindAsync(show_time_id);

            if (showTime == null)
                throw new Exception("ShowTime not found");

            _dbContext.ShowTimes.Remove(showTime);
            await _dbContext.SaveChangesAsync();
        }
    }
}