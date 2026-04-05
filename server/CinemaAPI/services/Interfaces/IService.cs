using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IService
    {
        Task<string> GetRoomsAsync(string? searchKeyword = null);
        Task<string> GetSnacksAsync(string? searchKeyword = null);
        Task<string> GetShowtimesAsync(string? searchKeyword = null);
        Task<string> GetMoviesAsync(string? searchKeyword = null);
        Task<string> GetGenresAsync(string? searchKeyword = null);
        Task<string> GetActorsAsync(string? searchKeyword = null);
    }
}