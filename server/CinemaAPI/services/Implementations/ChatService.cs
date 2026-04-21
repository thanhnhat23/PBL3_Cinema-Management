using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.data;
using CinemaAPI.Services.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using MongoDB.Driver;

namespace CinemaAPI.Services.Implementations
{
    public class ChatService : IChatService
    {
        private static readonly HashSet<string> RemoveWords = new(StringComparer.OrdinalIgnoreCase)
        {
            "cho", "phim", "movie", "rạp", "cinema", "bao giờ", "khi nào", "ở đâu", "có", "không",
            "chiếu", "gì", "thế nào", "như thế nào", "thông", "tin", "về", "thông tin", "tôi", "bạn", "em", "anh"
        };

        private readonly MongoDbContext _mongoDbContext;
        private readonly IService _Service;
        private readonly IGeminiService _geminiService;
        private readonly IMemoryCache _cache;
        private const int MaxLlmContextLength = 4000;

        public ChatService(MongoDbContext mongoDbContext, IService Service, IGeminiService geminiService, IMemoryCache cache)
        {
            _mongoDbContext = mongoDbContext;
            _Service = Service;
            _geminiService = geminiService;
            _cache = cache;
        }

        // Logic ChatBot: Input -> Check Info User -> Search Database -> Analytis Result -> Answer User
        // If missing info -> Ask User -> Loop until complete info -> Final Answer
        public async Task<ChatResponse> ProcessChatAsync(string user_id, string message)
        {
            // NODE 1: INPUT MESSAGE FROM USER
            if (!Guid.TryParse(user_id, out var userId))
                throw new ArgumentException("Invalid user_id format");

            var session = await _mongoDbContext.ChatSessions
                .Find(s => s.user_id == userId && s.status == "active")
                .FirstOrDefaultAsync()
                ?? new ChatSession { user_id = userId };

            // NODE 2 & 3: SEARCH DATABASE BASED ON MESSAGE CONTENT
            var msgLower = message.ToLower();
            string db = "";

            // Extract keyword for searching
            string? searchKeyword = ExtractSearchKeyword(message);

            // Only load data relevant to query
            if (msgLower.Contains("phim") || msgLower.Contains("movie"))
            {
                db += await GetCachedDataAsync("movies", searchKeyword, () => _Service.GetMoviesAsync(searchKeyword));
                if (string.IsNullOrWhiteSpace(db) && !string.IsNullOrEmpty(searchKeyword))
                    db += await GetCachedDataAsync("movies", null, () => _Service.GetMoviesAsync(null));
            }
            else if (msgLower.Contains("phòng") || msgLower.Contains("room") || msgLower.Contains("giá"))
                db += await GetCachedDataAsync("rooms", searchKeyword, () => _Service.GetRoomsAsync(searchKeyword));
            else if (msgLower.Contains("ăn")
                    || msgLower.Contains("đồ ăn")
                    || msgLower.Contains("snack")
                    || msgLower.Contains("bỏng")
                    || msgLower.Contains("nước uống")
                    || msgLower.Contains("drink"))
                db += await GetCachedDataAsync("snacks", searchKeyword, () => _Service.GetSnacksAsync(searchKeyword));
            else if (msgLower.Contains("thể loại") || msgLower.Contains("genre"))
                db += await GetCachedDataAsync("genres", searchKeyword, () => _Service.GetGenresAsync(searchKeyword));
            else if (msgLower.Contains("diễn viên") || msgLower.Contains("actor") || msgLower.Contains("cast"))
                db += await GetCachedDataAsync("actors", searchKeyword, () => _Service.GetActorsAsync(searchKeyword));
            else
                db += await GetCachedDataAsync("movies", searchKeyword, () => _Service.GetMoviesAsync(searchKeyword));

            db = TrimContext(db, MaxLlmContextLength);

            // NODE 4: GENERATE ANSWER
            string reply = await _geminiService.GenerateResponseAsync(message, db);

            session.messages.Add(new ChatMessage
            {
                role = "user",
                message = message,
                timestamp = DateTime.UtcNow
            });

            session.messages.Add(new ChatMessage
            {
                role = "assistant",
                message = reply,
                timestamp = DateTime.UtcNow
            });

            await _mongoDbContext.ChatSessions.ReplaceOneAsync(
                s => s.user_id == session.user_id && s.status == "active",
                session,
                new ReplaceOptions { IsUpsert = true }
            );

            return new ChatResponse
            {
                reply = reply,
                ExtractedInfo = new Dictionary<string, string>(),
                isInfoComplete = true
            };
        }

        private async Task<string> GetCachedDataAsync(string category, string? keyword, Func<Task<string>> factory)
        {
            var cacheKey = RagCacheKeys.Build("chat", category, keyword);
            if (_cache.TryGetValue(cacheKey, out string? cached) && !string.IsNullOrWhiteSpace(cached))
            {
                return cached;
            }

            var data = await factory();
            _cache.Set(cacheKey, data, TimeSpan.FromMinutes(3));
            return data;
        }

        private static string TrimContext(string? content, int maxLength)
        {
            if (string.IsNullOrWhiteSpace(content)) return string.Empty;
            if (content.Length <= maxLength) return content;
            return content[..maxLength] + "...";
        }

        // Helper method to extract search keywords from message
        private string? ExtractSearchKeyword(string message)
        {
            // Remove common words to extract potential movie/cinema names
            var words = message.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            var filteredWords = words.Where(w => !RemoveWords.Contains(w) && w.Length > 1).ToList();

            // Return last 1-2 words (usually contains the movie/cinema name)
            if (filteredWords.Count >= 2)
                return string.Join(" ", filteredWords.TakeLast(2));
            else if (filteredWords.Count == 1)
                return filteredWords[0];

            return null;
        }
    }
}