using CinemaAPI.Models.DTOs;
using CinemaAPI.Models;
using CinemaAPI.Services.Interfaces;
using CinemaAPI.data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace CinemaAPI.Services.Implementations
{
    public class Service : IService
    {
        private const int DefaultLimit = 20;
        private const int SearchLimit = 10;
        private const int MaxOutputLength = 4000;
        private const int MaxTextLength = 180;

        private readonly AppDbContext _dbContext;
        private readonly IMemoryCache _cache;

        public Service(AppDbContext dbContext, IMemoryCache cache)
        {
            _dbContext = dbContext;
            _cache = cache;
        }

        public async Task<string> GetRoomsAsync(string? searchKeyword = null)
        {
            var cacheKey = $"service:rooms:{searchKeyword?.Trim().ToLowerInvariant() ?? "all"}";
            if (_cache.TryGetValue(cacheKey, out string? cachedRooms) && !string.IsNullOrWhiteSpace(cachedRooms))
            {
                return cachedRooms;
            }

            var query = _dbContext.Rooms
                        .Include(r => r.Cinema)
                        .ThenInclude(l => l.Location)
                        .AsNoTracking()
                        .AsQueryable();

            if (!string.IsNullOrEmpty(searchKeyword))
            {
                // Case-insensitive search
                var keywordLower = searchKeyword.ToLower();
                query = query.Where(r => r.Cinema.name.ToLower().Contains(keywordLower) || r.Cinema.Location.city.ToLower().Contains(keywordLower));
                query = query.Take(SearchLimit);
            }
            else
            {
                query = query.Take(DefaultLimit);
            }

            var rooms = await query.Select(r => new
            {
                Name = r.Cinema.name,
                Address = r.Cinema.address,
                City = r.Cinema.Location.city,
                Description = r.Cinema.description,
                PhoneNumber = r.Cinema.phone_number,
                Room = r.nameRoom,
                RoomLayout = r.roomLayoutType,
                RoomPrice = r.price,
            })
                        .ToListAsync();

            var result = string.Join("\n", rooms.Select(r =>
               $"Rạp: {Shorten(r.Name, 80)}, Địa chỉ: {Shorten(r.Address, 120)}, Thành phố: {Shorten(r.City, 60)}, Mô tả: {Shorten(r.Description, MaxTextLength)}, Hotline: {Shorten(r.PhoneNumber, 20)}, Phòng: {Shorten(r.Room, 40)}, Định dạng phòng: {r.RoomLayout}, Giá vé: {r.RoomPrice}"
            ));

            var output = Truncate(result, MaxOutputLength);
            _cache.Set(cacheKey, output, TimeSpan.FromMinutes(5));
            return output;
        }

        public async Task<string> GetSnacksAsync(string? searchKeyword = null)
        {
            var cacheKey = $"service:snacks:{searchKeyword?.Trim().ToLowerInvariant() ?? "all"}";
            if (_cache.TryGetValue(cacheKey, out string? cachedSnacks) && !string.IsNullOrWhiteSpace(cachedSnacks))
            {
                return cachedSnacks;
            }

            var query = _dbContext.Snacks.AsQueryable();

            if (!string.IsNullOrEmpty(searchKeyword))
            {
                // Case-insensitive search
                var keywordLower = searchKeyword.ToLower();
                query = query.Where(s => s.name.ToLower().Contains(keywordLower) || s.type.ToString().ToLower().Contains(keywordLower));
                query = query.Take(SearchLimit);
            }
            else
            {
                query = query.Take(DefaultLimit);
            }

            var snacks = await query.Select(s => new
            {
                s.name,
                s.type,
                s.price
            })
                        .ToListAsync();

            var result = string.Join("\n", snacks.Select(s =>
                    $"Tên món: {Shorten(s.name, 80)}, Loại: {s.type}, Giá: {s.price}"
            ));

            var output = Truncate(result, MaxOutputLength);
            _cache.Set(cacheKey, output, TimeSpan.FromMinutes(5));
            return output;
        }

        public async Task<string> GetShowtimesAsync(string? searchKeyword = null)
        {
            throw new Exception("Not implemented yet");
        }

        public async Task<string> GetMoviesAsync(string? searchKeyword = null)
        {
            var cacheKey = $"service:movies:{searchKeyword?.Trim().ToLowerInvariant() ?? "all"}";
            if (_cache.TryGetValue(cacheKey, out string? cachedMovies) && !string.IsNullOrWhiteSpace(cachedMovies))
            {
                return cachedMovies;
            }

            var query = _dbContext.Movies
                        .Include(m => m.MovieGenres)
                            .ThenInclude(mg => mg.Genre)
                        .Include(m => m.MovieActors)
                            .ThenInclude(ma => ma.Actor)
                        .AsNoTracking()
                        .AsQueryable();

            if (!string.IsNullOrEmpty(searchKeyword))
            {
                // Case-insensitive search with better matching
                var keywordLower = searchKeyword.ToLower();
                query = query.Where(m => m.title.ToLower().Contains(keywordLower));
                query = query.OrderByDescending(m => m.release_date).Take(SearchLimit);
            }
            else
                query = query.Where(m => m.status == MovieStatus.Released || m.status == MovieStatus.Upcoming)
                            .OrderByDescending(m => m.release_date)
                            .Take(DefaultLimit);

            var movies = await query.Select(m => new
            {
                m.title,
                m.overview,
                m.release_date,
                m.end_date,
                m.vote_average,
                m.vote_count,
                m.runtime,
                m.status,
                genres = m.MovieGenres.Select(mg => mg.Genre.name).ToList(),
                actors = m.MovieActors.Select(ma => ma.Actor.name).ToList()
            })
            .ToListAsync();

            var result = string.Join("\n", movies.Select(m =>
                   $"Phim: {Shorten(m.title, 120)}, Mô tả: {Shorten(m.overview, MaxTextLength)}, Ngày chiếu: {m.release_date?.ToShortDateString() ?? ""}-{m.end_date?.ToShortDateString() ?? ""}, Đánh giá: {m.vote_average}/10, Thời lượng: {m.runtime}p, Thể loại: {string.Join(", ", m.genres)}, Diễn viên: {string.Join(", ", m.actors)}"
            ));

            var output = Truncate(result, MaxOutputLength);
            _cache.Set(cacheKey, output, TimeSpan.FromMinutes(5));
            return output;
        }

        public async Task<string> GetGenresAsync(string? searchKeyword = null)
        {
            const string cacheKey = "service:genres:all";
            if (_cache.TryGetValue(cacheKey, out string? cachedGenres) && !string.IsNullOrWhiteSpace(cachedGenres))
            {
                return cachedGenres;
            }

            var genres = await _dbContext.Genres
                        .AsNoTracking()
                        .Select(g => new { g.name })
                        .Take(DefaultLimit)
                        .ToListAsync();

            var result = string.Join("\n", genres.Select(g =>
               $"Tên thể loại: {Shorten(g.name, 100)}"
            ));

            var output = Truncate(result, MaxOutputLength);
            _cache.Set(cacheKey, output, TimeSpan.FromMinutes(10));
            return output;
        }

        public async Task<string> GetActorsAsync(string? searchKeyword = null)
        {
            var cacheKey = $"service:actors:{searchKeyword?.Trim().ToLowerInvariant() ?? "all"}";
            if (_cache.TryGetValue(cacheKey, out string? cachedActors) && !string.IsNullOrWhiteSpace(cachedActors))
            {
                return cachedActors;
            }

            var query = _dbContext.Actors.AsQueryable();

            if (!string.IsNullOrEmpty(searchKeyword))
            {
                // Case-insensitive search
                var keywordLower = searchKeyword.ToLower();
                query = query.Where(a => a.name.ToLower().Contains(keywordLower));
                query = query.Take(SearchLimit);
            }
            else
                query = query.Take(DefaultLimit);

            var actors = await query.Select(a => new
            {
                a.name,
                a.biography,
                a.place_of_birth,
                a.gender,
                a.birthday,
            })
            .ToListAsync();

            var result1 = string.Join("\n", actors.Select(a =>
               $"Tên diễn viên: {Shorten(a.name, 100)}, Tiểu sử: {Shorten(a.biography, MaxTextLength)}, Nơi sinh: {Shorten(a.place_of_birth, 100)}, Giới tính: {a.gender}"
            ));

            var output = Truncate(result1, MaxOutputLength);
            _cache.Set(cacheKey, output, TimeSpan.FromMinutes(5));
            return output;
        }

        private static string Truncate(string? input, int maxLength)
        {
            if (string.IsNullOrWhiteSpace(input)) return string.Empty;
            if (input.Length <= maxLength) return input;
            return input[..maxLength] + "...";
        }

        private static string Shorten(string? input, int maxLength)
        {
            if (string.IsNullOrWhiteSpace(input)) return string.Empty;
            if (input.Length <= maxLength) return input;
            return input[..maxLength] + "...";
        }
    }
}