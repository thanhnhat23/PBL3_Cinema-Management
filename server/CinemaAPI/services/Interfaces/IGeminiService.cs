namespace CinemaAPI.Services.Interfaces
{
    public interface IGeminiService
    {
        Task<GeminiExtractionResult> AnalyzeIntentAndExtractAsync(string message, Dictionary<string, string> currentContext);
        Task<string> GenerateResponseAsync(string userPrompt, string sqlContext);
    }

    public class GeminiExtractionResult
    {
        public Dictionary<string, string> ExtractedInfo { get; set; } = new();
        public bool IsInfoComplete { get; set; }
        public string Intent { get; set; } = ""; // "booking", "search_movie", "search_snack", v.v.
    }
}