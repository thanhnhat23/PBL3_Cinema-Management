using CinemaAPI.Models.DTOs;
using CinemaAPI.Models;
using CinemaAPI.Services.Interfaces;
using CinemaAPI.data;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class CinemaService : ICinemaService
    {
        private readonly AppDbContext _dbContext;

        public CinemaService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<string> GetRoomsAsync(string? searchKeyword = null)
        {
            var query = _dbContext.Rooms
                        .Include(r => r.Cinema)
                        .ThenInclude(l => l.Location)
                        .AsQueryable();

            if (!string.IsNullOrEmpty(searchKeyword))
            {
                // Case-insensitive search
                var keywordLower = searchKeyword.ToLower();
                query = query.Where(r => r.Cinema.name.ToLower().Contains(keywordLower) || r.Cinema.Location.city.ToLower().Contains(keywordLower));
            }
            else
            {
                query = query.Take(20);
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
               $"Rạp: {r.Name}, Địa chỉ: {r.Address}, Thành phố: {r.City}, Mô tả: {r.Description}, Hotline: {r.PhoneNumber}, Phòng: {r.Room}, Định dạng phòng: {r.RoomLayout}, Giá vé: {r.RoomPrice}"
            ));

            return result;
        }

        public async Task<string> GetSnacksAsync(string? searchKeyword = null)
        {
            var query = _dbContext.Snacks.AsQueryable();

            if (!string.IsNullOrEmpty(searchKeyword))
            {
                // Case-insensitive search
                var keywordLower = searchKeyword.ToLower();
                query = query.Where(s => s.name.ToLower().Contains(keywordLower) || s.type.ToString().ToLower().Contains(keywordLower));
            }

            var snacks = await query.Select(s => new
            {
                s.name,
                s.type,
                s.price
            })
                        .ToListAsync();

            var result = string.Join("\n", snacks.Select(s =>
               $"Tên món: {s.name}, Loại: {s.type}, Giá: {s.price}"
            ));

            return result;
        }

        public async Task<string> GetShowtimesAsync(string? searchKeyword = null)
        {
            throw new Exception("Not implemented yet");
        }

        public async Task<string> GetMoviesAsync(string? searchKeyword = null)
        {
            var query = _dbContext.Movies
                        .Include(m => m.MovieGenres)
                            .ThenInclude(mg => mg.Genre)
                        .Include(m => m.MovieActors)
                            .ThenInclude(ma => ma.Actor)
                        .AsQueryable();

            if (!string.IsNullOrEmpty(searchKeyword))
            {
                // Case-insensitive search with better matching
                var keywordLower = searchKeyword.ToLower();
                query = query.Where(m => m.title.ToLower().Contains(keywordLower));
            }
            else
                query = query.Where(m => m.status == MovieStatus.Released || m.status == MovieStatus.Upcoming)
                            .OrderByDescending(m => m.release_date)
                            .Take(30);

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
               $"Phim: {m.title}, Mô tả: {m.overview}, Ngày chiếu: {m.release_date.ToShortDateString()}-{m.end_date.ToShortDateString()}, Đánh giá: {m.vote_average}/10, Thời lượng: {m.runtime}p, Thể loại: {string.Join(", ", m.genres)}, Diễn viên: {string.Join(", ", m.actors)}"
            ));

            return result;
        }

        public async Task<string> GetGenresAsync(string? searchKeyword = null)
        {
            var genres = await _dbContext.Genres
                        .Select(g => new { g.name })
                        .ToListAsync();

            var result = string.Join("\n", genres.Select(g =>
               $"Tên thể loại: {g.name}"
            ));

            return result;
        }

        public async Task<string> GetActorsAsync(string? searchKeyword = null)
        {
            var query = _dbContext.Actors.AsQueryable();

            if (!string.IsNullOrEmpty(searchKeyword))
            {
                // Case-insensitive search
                var keywordLower = searchKeyword.ToLower();
                query = query.Where(a => a.name.ToLower().Contains(keywordLower));
            }
            else
                query = query.Take(30);

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
               $"Tên diễn viên: {a.name}, Tiểu sử: {a.biography}, Nơi sinh: {a.place_of_birth}, Giới tính: {a.gender}"
            ));

            return result1;
        }
    }
}