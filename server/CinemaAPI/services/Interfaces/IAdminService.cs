using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IAdminService
    {
        Task<int> GetTotalMoviesAsync();
        Task<int> GetTotalActorsAsync();
        Task<int> GetTotalGenresAsync();
        Task<int> GetTotalReviewsAsync();
        Task<List<MovieStatusCountResponse>> GetTotalMoviesByStatusAsync();
        Task<List<MovieMonthlyCountResponse>> GetTotalMoviesByMonthAsync();
        Task<List<MovieGenreCountResponse>> GetTotalMoviesByGenreAsync();
        Task<List<User>> GetAdminsAsync();
        Task<List<DeletedItemResponse>> GetDeletedItemsAsync();
        Task<bool> RestoreItemAsync(string type, string id);
        Task<bool> HardDeleteItemAsync(string type, string id);
    }
}