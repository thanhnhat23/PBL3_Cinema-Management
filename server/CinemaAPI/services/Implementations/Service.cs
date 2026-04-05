using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
<<<<<<<< HEAD:server/CinemaAPI/services/Implementations/Service.cs
    public class Service : IService
========
     public class CinemaService : ICinemaService
>>>>>>>> 7bd3e0f8d4b8d900de8b97b0c4911b5c79e3d30a:server/CinemaAPI/services/Implementations/CinemaService.cs
    {
         private readonly AppDbContext _dbContext;

<<<<<<<< HEAD:server/CinemaAPI/services/Implementations/Service.cs
        public Service(AppDbContext dbContext)
========
         public CinemaService(AppDbContext dbContext)
>>>>>>>> 7bd3e0f8d4b8d900de8b97b0c4911b5c79e3d30a:server/CinemaAPI/services/Implementations/CinemaService.cs
        {
            _dbContext = dbContext;
        }
         public async Task<List<Cinema>> GetAllCinemas() =>
            await _dbContext.Cinemas
                .Include(c => c.Rooms)
                .Include(c => c.Location)
                .ToListAsync();

        public async Task<Cinema?> GetCinemaById(int cinema_id) =>
            await _dbContext.Cinemas
                .Include(c => c.Rooms)
                .Include(c => c.Location)
                .FirstOrDefaultAsync( c => c.cinema_id == cinema_id);

        public async Task AddCinema(CinemaCreateRequest request)
        {
            try
            {
                var cinema = new Cinema
                {   
                    location_id = request.location_id,
                    name = request.name,
                    address = request.address,
                    phone_number = request.phone_number,
                    latitude = request.latitude,
                    longitude = request.longitude,
                    description = request.description,
                    image_overview = request.image_overview
                };
                _dbContext.Cinemas.Add(cinema);
                await _dbContext.SaveChangesAsync();                                          
        }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding cinema: {ex.Message}");
                throw new Exception($"An error occurred while adding the cinema: {ex.Message}");
            }
        }

        public async Task UpdateCinema(int cinema_id, CinemaUpdateRequest request)
        {
            try
            {
            var cinema = await _dbContext.Cinemas.FindAsync(cinema_id);
            if (cinema == null) return;

            cinema.name = request.name;
            cinema.address = request.address;
            cinema.location_id = request.location_id;
            cinema.phone_number = request.phone_number;
            cinema.latitude = request.latitude;
            cinema.longitude = request.longitude;
            cinema.description = request.description;
            cinema.image_overview = request.image_overview;

            await _dbContext.SaveChangesAsync();
        }
        catch(Exception ex)
            {
                Console.WriteLine($"Error updating cinema: {ex.Message}");
                throw new Exception($"An error occurred while updating the cinema: {ex.Message}");
            }
        }
        public async Task DeleteCinema(int cinema_id)
        {
            try
            {
            var cinema = await _dbContext.Cinemas
                .Include(c => c.Rooms)
                .FirstOrDefaultAsync(c => c.cinema_id == cinema_id);
                //.Include(c => c.Inventories)
            if (cinema == null) throw new Exception("Cinema not found");

            _dbContext.Rooms.RemoveRange(cinema.Rooms);
            //_dbContext.Inventories.RemoveRange(cinema.Inventories);
            _dbContext.Cinemas.Remove(cinema);
            await _dbContext.SaveChangesAsync();
        }
        catch(Exception ex)
            {
                Console.WriteLine($"Error deleting cinema: {ex.Message}");
                throw new Exception($"An error occurred while deleting the cinema: {ex.Message}");
            }
        }
    }
}

