using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.data;
using CinemaAPI.Services.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Hosting;
using MongoDB.Bson;
using MongoDB.Driver;

namespace CinemaAPI.Services.Implementations
{
    public class ChatService : IChatService
    {
        private static readonly HashSet<string> RemoveWords = new(StringComparer.OrdinalIgnoreCase)
        {
            "cho", "phim", "movie", "rạp", "cinema", "bao giờ", "khi nào", "ở đâu", "có", "không",
            "chiếu", "gì", "thế nào", "như thế nào", "thông", "tin", "về", "thông tin", "tôi", "bạn", "em", "anh",
            "còn", "thêm", "nữa", "tiếp", "vậy", "thế", "nhé", "lịch", "suất", "giờ"
        };

        private readonly MongoDbContext _mongoDbContext;
        private readonly IService _Service;
        private readonly IGeminiService _geminiService;
        private readonly IMemoryCache _cache;
        private readonly IHostEnvironment _hostEnvironment;
        private const int MaxLlmContextLength = 4000;

        public ChatService(MongoDbContext mongoDbContext, IService Service, IGeminiService geminiService, IMemoryCache cache, IHostEnvironment hostEnvironment)
        {
            _mongoDbContext = mongoDbContext;
            _Service = Service;
            _geminiService = geminiService;
            _cache = cache;
            _hostEnvironment = hostEnvironment;
        }

        // Logic ChatBot: Input -> Check Info User -> Search Database -> Analytis Result -> Answer User
        // If missing info -> Ask User -> Loop until complete info -> Final Answer
        public async Task<ChatResponse> ProcessChatAsync(string user_id, string message)
        {
            try
            {
                // NODE 1: INPUT MESSAGE FROM USER
                if (!Guid.TryParse(user_id, out var userId))
                    throw new ArgumentException("Invalid user_id format");

                var session = await _mongoDbContext.ChatSessions
                    .Find(s => s.user_id == userId && s.status == "active")
                    .FirstOrDefaultAsync()
                    ?? new ChatSession { user_id = userId };

                var msgLower = message.ToLower();

                if (TryGetGreetingReply(msgLower, out var greetingReply))
                {
                    session.messages.Add(new ChatMessage
                    {
                        role = "user",
                        message = message,
                        timestamp = DateTime.UtcNow
                    });

                    session.messages.Add(new ChatMessage
                    {
                        role = "assistant",
                        message = greetingReply,
                        timestamp = DateTime.UtcNow
                    });

                    if (string.IsNullOrWhiteSpace(session.session_id))
                    {
                        session.session_id = ObjectId.GenerateNewId().ToString();
                    }

                    await _mongoDbContext.ChatSessions.ReplaceOneAsync(
                        s => s.user_id == session.user_id && s.status == "active",
                        session,
                        new ReplaceOptions { IsUpsert = true }
                    );

                    return new ChatResponse
                    {
                        reply = greetingReply,
                        ExtractedInfo = new Dictionary<string, string>(),
                        isInfoComplete = true,
                        ErrorDetail = null
                    };
                }

                // NODE 2 & 3: SEARCH DATABASE BASED ON MESSAGE CONTENT
                string db = "";

                // Extract keyword for searching
                string? searchKeyword = ExtractSearchKeyword(message);
                string? resolvedCategory = ResolveCategoryFromHistory(message, session.messages);
                string conversationContext = BuildConversationContext(session.messages, message);

                if (string.IsNullOrWhiteSpace(searchKeyword) && !string.IsNullOrWhiteSpace(resolvedCategory))
                {
                    searchKeyword = ExtractSearchKeyword(GetMostRecentUserMessage(session.messages) ?? message);
                }

                // Only load data relevant to query
                if (resolvedCategory == "movies" || msgLower.Contains("phim") || msgLower.Contains("movie"))
                {
                    db += await GetCachedDataAsync("movies", searchKeyword, () => _Service.GetMoviesAsync(searchKeyword));
                    if (string.IsNullOrWhiteSpace(db) && !string.IsNullOrEmpty(searchKeyword))
                        db += await GetCachedDataAsync("movies", null, () => _Service.GetMoviesAsync(null));
                }
                else if (resolvedCategory == "showtimes"
                        || msgLower.Contains("lịch chiếu")
                        || msgLower.Contains("suất chiếu")
                        || msgLower.Contains("giờ chiếu")
                        || msgLower.Contains("showtime"))
                    db += await GetCachedDataAsync("showtimes", searchKeyword, () => _Service.GetShowtimesAsync(searchKeyword));
                else if (resolvedCategory == "rooms" || msgLower.Contains("phòng") || msgLower.Contains("room") || msgLower.Contains("giá"))
                    db += await GetCachedDataAsync("rooms", searchKeyword, () => _Service.GetRoomsAsync(searchKeyword));
                else if (resolvedCategory == "snacks" || msgLower.Contains("ăn")
                        || msgLower.Contains("đồ ăn")
                        || msgLower.Contains("snack")
                        || msgLower.Contains("bỏng")
                        || msgLower.Contains("nước uống")
                        || msgLower.Contains("drink"))
                    db += await GetCachedDataAsync("snacks", searchKeyword, () => _Service.GetSnacksAsync(searchKeyword));
                else if (resolvedCategory == "genres" || msgLower.Contains("thể loại") || msgLower.Contains("genre"))
                    db += await GetCachedDataAsync("genres", searchKeyword, () => _Service.GetGenresAsync(searchKeyword));
                else if (resolvedCategory == "actors" || msgLower.Contains("diễn viên") || msgLower.Contains("actor") || msgLower.Contains("cast"))
                    db += await GetCachedDataAsync("actors", searchKeyword, () => _Service.GetActorsAsync(searchKeyword));
                else
                    db += await GetCachedDataAsync("movies", searchKeyword, () => _Service.GetMoviesAsync(searchKeyword));

                db = TrimContext(db, MaxLlmContextLength);

                // NODE 4: GENERATE ANSWER
                string reply;
                string? errorDetail = null;
                try
                {
                    reply = await _geminiService.GenerateResponseAsync(message, db, conversationContext);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error generating chat response: {ex.Message}");
                    reply = "Xin lỗi, hiện tại trợ lý đang bận hoặc chưa sẵn sàng. Vui lòng thử lại sau ít phút.";
                    if (_hostEnvironment.IsDevelopment())
                        errorDetail = $"GeminiService: {ex.Message}";
                }

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

                if (string.IsNullOrWhiteSpace(session.session_id))
                {
                    session.session_id = ObjectId.GenerateNewId().ToString();
                }

                await _mongoDbContext.ChatSessions.ReplaceOneAsync(
                    s => s.user_id == session.user_id && s.status == "active",
                    session,
                    new ReplaceOptions { IsUpsert = true }
                );

                return new ChatResponse
                {
                    reply = reply,
                    ExtractedInfo = new Dictionary<string, string>(),
                    isInfoComplete = true,
                    ErrorDetail = errorDetail
                };
            }
            catch (ArgumentException)
            {
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error in chat service: {ex.Message}");
                return new ChatResponse
                {
                    reply = "Xin lỗi, hiện tại tôi không thể xử lý yêu cầu này. Vui lòng thử lại sau.",
                    ExtractedInfo = new Dictionary<string, string>(),
                    isInfoComplete = false,
                    ErrorDetail = _hostEnvironment.IsDevelopment() ? ex.Message : null
                };
            }
        }

        public async Task<ChatHistoryResponse> GetChatHistoryAsync(string user_id)
        {
            if (!Guid.TryParse(user_id, out var userId))
            {
                return new ChatHistoryResponse();
            }

            var session = await _mongoDbContext.ChatSessions
                .Find(s => s.user_id == userId && s.status == "active")
                .FirstOrDefaultAsync();

            if (session == null || session.messages.Count == 0)
            {
                return new ChatHistoryResponse();
            }

            return new ChatHistoryResponse
            {
                messages = session.messages
                    .OrderBy(message => message.timestamp)
                    .Select(message => new ChatHistoryMessageDto
                    {
                        role = message.role,
                        message = message.message,
                        timestamp = message.timestamp
                    })
                    .ToList()
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

        private static string BuildConversationContext(IReadOnlyList<ChatMessage> messages, string currentMessage, int maxMessages = 6)
        {
            var recentMessages = messages
                .TakeLast(maxMessages)
                .Select(message => $"{message.role}: {message.message}")
                .ToList();

            recentMessages.Add($"user: {currentMessage}");
            return string.Join(Environment.NewLine, recentMessages);
        }

        private static string? GetMostRecentUserMessage(IReadOnlyList<ChatMessage> messages)
        {
            return messages
                .LastOrDefault(message => message.role == "user")
                ?.message;
        }

        private static string? ResolveCategoryFromHistory(string message, IReadOnlyList<ChatMessage> messages)
        {
            var currentCategory = DetectCategory(message);
            if (!string.IsNullOrWhiteSpace(currentCategory))
            {
                return currentCategory;
            }

            if (!LooksLikeFollowUp(message))
            {
                return null;
            }

            foreach (var previousUserMessage in messages.Reverse())
            {
                if (previousUserMessage.role != "user")
                {
                    continue;
                }

                var previousCategory = DetectCategory(previousUserMessage.message);
                if (!string.IsNullOrWhiteSpace(previousCategory))
                {
                    return previousCategory;
                }
            }

            return null;
        }

        private static string? DetectCategory(string message)
        {
            var normalized = message.ToLowerInvariant();

            if (normalized.Contains("lịch chiếu") || normalized.Contains("suất chiếu") || normalized.Contains("giờ chiếu") || normalized.Contains("showtime"))
            {
                return "showtimes";
            }

            if (normalized.Contains("diễn viên") || normalized.Contains("actor") || normalized.Contains("cast"))
            {
                return "actors";
            }

            if (normalized.Contains("phòng") || normalized.Contains("room") || normalized.Contains("giá"))
            {
                return "rooms";
            }

            if (normalized.Contains("ăn") || normalized.Contains("đồ ăn") || normalized.Contains("snack") || normalized.Contains("bỏng") || normalized.Contains("nước uống") || normalized.Contains("drink"))
            {
                return "snacks";
            }

            if (normalized.Contains("thể loại") || normalized.Contains("genre"))
            {
                return "genres";
            }

            if (normalized.Contains("phim") || normalized.Contains("movie"))
            {
                return "movies";
            }

            return null;
        }

        private static bool LooksLikeFollowUp(string message)
        {
            var normalized = message.Trim().ToLowerInvariant();

            return normalized.StartsWith("còn ")
                || normalized.StartsWith("con ")
                || normalized.StartsWith("thế ")
                || normalized.StartsWith("vậy ")
                || normalized.StartsWith("tiếp ")
                || normalized.StartsWith("nữa ")
                || normalized == "còn"
                || normalized == "thế"
                || normalized == "vậy";
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

        private static bool TryGetGreetingReply(string message, out string reply)
        {
            var normalized = message.Trim().ToLowerInvariant();

            if (string.IsNullOrWhiteSpace(normalized))
            {
                reply = string.Empty;
                return false;
            }

            var greetingKeywords = new[]
            {
                "hi",
                "hello",
                "hey",
                "yo",
                "xin chào",
                "chào",
                "chao",
                "hello bot",
                "hi bot"
            };

            if (greetingKeywords.Any(keyword => normalized == keyword || normalized.StartsWith(keyword + " ")))
            {
                reply = "Chào bạn, mình là trợ lý MilkyWayyy đây. Bạn cần mình tìm phim, xem lịch chiếu hay hỗ trợ gì nào?";
                return true;
            }

            reply = string.Empty;
            return false;
        }
    }
}