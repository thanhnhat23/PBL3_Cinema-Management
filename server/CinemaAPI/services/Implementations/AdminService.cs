using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;

namespace CinemaAPI.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _dbContext;
        private readonly MongoDbContext _mongoDbContext;

        public AdminService(AppDbContext dbContext, MongoDbContext mongoDbContext)
        {
            _dbContext = dbContext;
            _mongoDbContext = mongoDbContext;
        }

        public async Task<int> GetTotalMoviesAsync() =>
            await _dbContext.Movies.AsNoTracking().CountAsync();

        public async Task<int> GetTotalActorsAsync() =>
            await _dbContext.Actors.AsNoTracking().CountAsync();

        public async Task<int> GetTotalGenresAsync() =>
            await _dbContext.Genres.AsNoTracking().CountAsync();

        public async Task<int> GetTotalReviewsAsync() =>
            (int)await _mongoDbContext.Reviews.CountDocumentsAsync(FilterDefinition<Review>.Empty);

        public async Task<List<MovieStatusCountResponse>> GetTotalMoviesByStatusAsync()
        {
            var statusCounts = await _dbContext.Movies
                .AsNoTracking()
                .GroupBy(movie => movie.status)
                .Select(group => new
                {
                    Status = group.Key,
                    Total = group.Count()
                })
                .ToListAsync();

            var statusCountMap = statusCounts.ToDictionary(item => item.Status, item => item.Total);

            var orderedStatuses = new[]
            {
                MovieStatus.Released,
                MovieStatus.Upcoming,
                MovieStatus.Ended
            };

            return orderedStatuses
                .Select(status => new MovieStatusCountResponse
                {
                    status = status.ToString().ToLowerInvariant(),
                    total = statusCountMap.GetValueOrDefault(status, 0)
                })
                .ToList();
        }

        public async Task<List<MovieMonthlyCountResponse>> GetTotalMoviesByMonthAsync()
        {
            var currentYear = DateTime.UtcNow.Year;
            var monthNames = new[]
            {
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            };

            var monthCounts = await _dbContext.Movies
                .AsNoTracking()
                .Where(movie => movie.release_date.HasValue && movie.release_date.Value.Year == currentYear)
                .GroupBy(movie => movie.release_date!.Value.Month)
                .Select(group => new
                {
                    Month = group.Key,
                    Total = group.Count()
                })
                .ToListAsync();

            var monthCountMap = monthCounts.ToDictionary(item => item.Month, item => item.Total);

            return Enumerable.Range(1, 12)
                .Select(month => new MovieMonthlyCountResponse
                {
                    month = month,
                    monthName = monthNames[month - 1],
                    total = monthCountMap.GetValueOrDefault(month, 0)
                })
                .ToList();
        }

        public async Task<List<MovieGenreCountResponse>> GetTotalMoviesByGenreAsync() =>
            await _dbContext.Genres
                .AsNoTracking()
                .Select(genre => new MovieGenreCountResponse
                {
                    genreId = genre.genre_id,
                    genre = genre.name,
                    movie = genre.MovieGenres.Count
                })
                .OrderByDescending(item => item.movie)
                .ToListAsync();

        public async Task<List<User>> GetAdminsAsync() =>
            await _dbContext.Users
                .AsNoTracking()
                .Where(user => user.role == UserType.Admin)
                .ToListAsync();

        public async Task<List<DeletedItemResponse>> GetDeletedItemsAsync()
        {
            var deletedItems = new List<DeletedItemResponse>();

            // Cinemas
            var deletedCinemas = await _dbContext.Cinemas
                .AsNoTracking()
                .Where(c => c.deleted_at != null)
                .Join(_dbContext.Users,
                    c => c.deleted_by,
                    u => u.user_id,
                    (c, u) => new DeletedItemResponse
                    {
                        Id = c.cinema_id.ToString(),
                        Name = c.name,
                        Type = "cinema",
                        DeletedAt = c.deleted_at,
                        DeletedByUserId = c.deleted_by,
                        DeletedByUserName = u.userName,
                        DeletedByAvatarPath = u.avatar_path
                    })
                .ToListAsync();
            deletedItems.AddRange(deletedCinemas);

            // Coupons
            var deletedCoupons = await _dbContext.Coupons
                .AsNoTracking()
                .Where(c => c.deleted_at != null)
                .Join(_dbContext.Users,
                    c => c.deleted_by,
                    u => u.user_id,
                    (c, u) => new DeletedItemResponse
                    {
                        Id = c.coupon_id.ToString(),
                        Name = c.code ?? string.Empty,
                        Type = "coupon",
                        DeletedAt = c.deleted_at,
                        DeletedByUserId = c.deleted_by,
                        DeletedByUserName = u.userName,
                        DeletedByAvatarPath = u.avatar_path
                    })
                .ToListAsync();
            deletedItems.AddRange(deletedCoupons);

            // Snacks
            var deletedSnacks = await _dbContext.Snacks
                .AsNoTracking()
                .Where(s => s.deleted_at != null)
                .Join(_dbContext.Users,
                    s => s.deleted_by,
                    u => u.user_id,
                    (s, u) => new DeletedItemResponse
                    {
                        Id = s.snack_id.ToString(),
                        Name = s.name,
                        Type = "snack",
                        DeletedAt = s.deleted_at,
                        DeletedByUserId = s.deleted_by,
                        DeletedByUserName = u.userName,
                        DeletedByAvatarPath = u.avatar_path
                    })
                .ToListAsync();
            deletedItems.AddRange(deletedSnacks);

            // Rooms
            var deletedRooms = await _dbContext.Rooms
                .AsNoTracking()
                .Where(r => r.deleted_at != null)
                .Join(_dbContext.Users,
                    r => r.deleted_by,
                    u => u.user_id,
                    (r, u) => new DeletedItemResponse
                    {
                        Id = r.room_id.ToString(),
                        Name = r.nameRoom,
                        Type = "room",
                        DeletedAt = r.deleted_at,
                        DeletedByUserId = r.deleted_by,
                        DeletedByUserName = u.userName,
                        DeletedByAvatarPath = u.avatar_path
                    })
                .ToListAsync();
            deletedItems.AddRange(deletedRooms);

            // Locations
            var deletedLocations = await _dbContext.Locations
                .AsNoTracking()
                .Where(l => l.deleted_at != null)
                .Join(_dbContext.Users,
                    l => l.deleted_by,
                    u => u.user_id,
                    (l, u) => new DeletedItemResponse
                    {
                        Id = l.location_id.ToString(),
                        Name = l.city,
                        Type = "location",
                        DeletedAt = l.deleted_at,
                        DeletedByUserId = l.deleted_by,
                        DeletedByUserName = u.userName,
                        DeletedByAvatarPath = u.avatar_path
                    })
                .ToListAsync();
            deletedItems.AddRange(deletedLocations);

            // Showtimes
            var deletedShowtimes = await _dbContext.ShowTimes
                .AsNoTracking()
                .Where(s => s.deleted_at != null)
                .Join(_dbContext.Users,
                    s => s.deleted_by,
                    u => u.user_id,
                    (s, u) => new DeletedItemResponse
                    {
                        Id = s.showtime_id.ToString(),
                        Name = $"Showtime {s.showtime_id}",
                        Type = "showtime",
                        DeletedAt = s.deleted_at,
                        DeletedByUserId = s.deleted_by,
                        DeletedByUserName = u.userName,
                        DeletedByAvatarPath = u.avatar_path
                    })
                .ToListAsync();
            deletedItems.AddRange(deletedShowtimes);

            return deletedItems.OrderByDescending(i => i.DeletedAt).ToList();
        }

        public async Task<bool> RestoreItemAsync(string type, string id)
        {
            int intId = int.TryParse(id, out var result) ? result : 0;
            switch (type.ToLower())
            {
                case "cinema":
                    var cinema = await _dbContext.Cinemas.FindAsync(intId);
                    if (cinema != null)
                    {
                        cinema.deleted_at = null;
                        await _dbContext.SaveChangesAsync();
                        return true;
                    }
                    break;
                case "coupon":
                    var coupon = await _dbContext.Coupons.FindAsync(intId);
                    if (coupon != null)
                    {
                        coupon.deleted_at = null;
                        await _dbContext.SaveChangesAsync();
                        return true;
                    }
                    break;
                case "snack":
                    var snack = await _dbContext.Snacks.FindAsync(intId);
                    if (snack != null)
                    {
                        snack.deleted_at = null;
                        await _dbContext.SaveChangesAsync();
                        return true;
                    }
                    break;
                case "room":
                    var room = await _dbContext.Rooms.FindAsync(intId);
                    if (room != null)
                    {
                        room.deleted_at = null;
                        await _dbContext.SaveChangesAsync();
                        return true;
                    }
                    break;
                case "location":
                    var location = await _dbContext.Locations.FindAsync(intId);
                    if (location != null)
                    {
                        location.deleted_at = null;
                        await _dbContext.SaveChangesAsync();
                        return true;
                    }
                    break;
                case "showtime":
                    var showtime = await _dbContext.ShowTimes.FindAsync(intId);
                    if (showtime != null)
                    {
                        showtime.deleted_at = null;
                        await _dbContext.SaveChangesAsync();
                        return true;
                    }
                    break;
            }
            return false;
        }

        public async Task<bool> HardDeleteItemAsync(string type, string id)
        {
            int intId = int.TryParse(id, out var result) ? result : 0;
            switch (type.ToLower())
            {
                case "cinema":
                    var cinema = await _dbContext.Cinemas.Include(c => c.Rooms).Include(c => c.Inventories).FirstOrDefaultAsync(c => c.cinema_id == intId);
                    if (cinema != null)
                    {
                        if (cinema.Rooms.Any() || cinema.Inventories.Any())
                            return false;

                        _dbContext.Cinemas.Remove(cinema);
                        await _dbContext.SaveChangesAsync();
                        return true;
                    }
                    break;
                case "coupon":
                    var coupon = await _dbContext.Coupons.Include(c => c.Bookings).Include(c => c.UserVouchers).FirstOrDefaultAsync(c => c.coupon_id == intId);
                    if (coupon != null)
                    {
                        if (coupon.Bookings.Any() || coupon.UserVouchers.Any())
                            return false;

                        _dbContext.Coupons.Remove(coupon);
                        await _dbContext.SaveChangesAsync();
                        return true;
                    }
                    break;
                case "snack":
                    var snack = await _dbContext.Snacks.Include(s => s.BookingSnacks).Include(s => s.ComboDetails).Include(s => s.Inventory).FirstOrDefaultAsync(s => s.snack_id == intId);
                    if (snack != null)
                    {
                        if (snack.BookingSnacks.Any() || snack.ComboDetails.Any() || snack.Inventory.Any())
                            return false;

                        _dbContext.Snacks.Remove(snack);
                        await _dbContext.SaveChangesAsync();
                        return true;
                    }
                    break;
                case "room":
                    var room = await _dbContext.Rooms.Include(r => r.Seats).Include(r => r.Showtimes).FirstOrDefaultAsync(r => r.room_id == intId);
                    if (room != null)
                    {
                        if (room.Seats.Any() || room.Showtimes.Any())
                            return false;
                        _dbContext.Rooms.Remove(room);
                        await _dbContext.SaveChangesAsync();
                        return true;
                    }
                    break;
                case "location":
                    var location = await _dbContext.Locations.Include(l => l.Cinemas).FirstOrDefaultAsync(l => l.location_id == intId);
                    if (location != null)
                    {
                        if (location.Cinemas.Any())
                            return false;

                        _dbContext.Locations.Remove(location);
                        await _dbContext.SaveChangesAsync();
                        return true;
                    }
                    break;
                case "showtime":
                    var showtime = await _dbContext.ShowTimes.Include(s => s.Bookings).FirstOrDefaultAsync(s => s.showtime_id == intId);
                    if (showtime != null)
                    {
                        if (showtime.Bookings.Any())
                            return false;

                        _dbContext.ShowTimes.Remove(showtime);
                        await _dbContext.SaveChangesAsync();
                        return true;
                    }
                    break;
            }
            return false;
        }
    }
}