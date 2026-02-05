using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IChatService
    {
        Task<ChatResponse> ProcessChatAsync(string user_id, string message);
    }
}