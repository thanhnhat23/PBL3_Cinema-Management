using Google.GenAI;
using Google.GenAI.Types;
using Microsoft.Extensions.Options;
using CinemaAPI.Models;
using CinemaAPI.Services.Interfaces;
using System.Text.Json;

namespace CinemaAPI.Services.Implementations
{
    public class GeminiService : IGeminiService
    {
        private readonly Client _client;
        private readonly string _modelName;

        public GeminiService(IOptions<GeminiConfig> geminiConfig)
        {
            _client = new Client(apiKey: geminiConfig.Value.ApiKey);
            _modelName = geminiConfig.Value.Model;
        }

        public async Task<GeminiExtractionResult> AnalyzeIntentAndExtractAsync(string message, Dictionary<string, string> currentContext)
        {
            var contextStr = JsonSerializer.Serialize(currentContext);

            string prompt = $@"
                Phân tích câu chat: '{message}'.
                Ngữ cảnh hiện tại: {contextStr}.
                Trích xuất các thông tin: intent (booking/search_movie/search_snack/ask_info), movie_name, cinema_name, city, snack_name, date, time.
                Trả về DUY NHẤT một đối tượng JSON với format:
                {{
                    ""intent"": ""booking"",
                    ""movie_name"": ""tên phim hoặc null"",
                    ""cinema_name"": ""tên rạp hoặc null"",
                    ""city"": ""thành phố hoặc null"",
                    ""snack_name"": ""tên đồ ăn hoặc null"",
                    ""date"": ""ngày hoặc null"",
                    ""time"": ""giờ hoặc null""
                }}";

            var response = await _client.Models.GenerateContentAsync(_modelName, prompt);

            try
            {
                var responseText = response.Candidates?[0]?.Content?.Parts?[0]?.Text ?? "";
                var cleanJson = responseText.Replace("```json", "").Replace("```", "").Trim();
                var extracted = JsonSerializer.Deserialize<Dictionary<string, string>>(cleanJson) ?? new();

                // Determine if info is complete based on intent
                string intent = extracted.GetValueOrDefault("intent", "");
                bool isComplete = false;

                if (intent == "booking")
                {
                    isComplete = extracted.ContainsKey("movie_name") &&
                                extracted.ContainsKey("cinema_name") &&
                                extracted.ContainsKey("date");
                }
                else if (intent.StartsWith("search"))
                {
                    isComplete = true; // Search queries are typically complete as-is
                }

                return new GeminiExtractionResult
                {
                    ExtractedInfo = extracted,
                    IsInfoComplete = isComplete,
                    Intent = intent
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error parsing Gemini response: {ex.Message}");
                return new GeminiExtractionResult(); // Return empty result on error
            }
        }

        public async Task<string> GenerateResponseAsync(string userPrompt, string sqlContext)
        {
            // LLM prompt to generate user-friendly response
            string prompt = $@"
                Bạn là trợ lý MilkyWayyy Cinema - một rạp chiếu phim chuyên nghiệp.
                CHỈ sử dụng dữ liệu sau để trả lời: {sqlContext}
                ---
                RULES:
                - Bắt đầu bằng lời chào thân thiện (ví dụ: 'Xin chào bạn!', 'Chào mừng bạn đến với MilkyWayyy!')
                - Trả lời chi tiết, thân thiện và chuyên nghiệp.
                - Luôn cảm ơn khách hàng vì đã liên hệ (ví dụ: 'Cảm ơn bạn đã lựa chọn MilkyWayyy Cinema!')
                - Cung cấp thông tin đầy đủ: tên phim, rạp chiếu, ngày giờ, giá vé, thông tin khác...
                - Không thêm kiến thức bên ngoài dữ liệu được cung cấp.
                - Nếu dữ liệu trống hoặc không có thông tin khách hỏi, hãy nói: 'Xin lỗi, hiện tại hệ thống chưa có thông tin này. Vui lòng liên hệ với chúng tôi với hotline 1900 2310 để được hỗ trợ thêm.'
                - KHÔNG trả lời nếu không có dữ liệu. Không đoán mò.
                - Trả lời bằng tiếng Việt.
                - Nếu câu hỏi không liên quan đến rạp chiếu phim, trả lời thân thiện: 'Tôi xin lỗi, tôi chỉ có thể hỗ trợ về thông tin rạp chiếu phim tại MilkyWayyy Cinema. Hãy hỏi tôi về phim, vé, hoặc các dịch vụ khác!'
                - Kết thúc bằng lời khuyến khích (ví dụ: 'Chúng tôi rất mong chào đón bạn!', 'Hãy ghé thăm MilkyWayyy Cinema nhé!')\n                ---
                Câu hỏi khách hàng: {userPrompt}";

            var response = await _client.Models.GenerateContentAsync(_modelName, prompt);

            return response.Candidates?[0]?.Content?.Parts?[0]?.Text ?? "Xin lỗi, hiện tại tôi không thể tạo phản hồi. Vui lòng thử lại sau.";
        }
    }
}