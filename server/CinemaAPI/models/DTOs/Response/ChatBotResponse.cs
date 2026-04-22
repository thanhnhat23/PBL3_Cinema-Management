namespace CinemaAPI.Models.DTOs
{
    public class ChatRequest
    {
        public string message { get; set; } = null!; // User
    }

    public class ChatResponse
    {
        public string reply { get; set;} = null!; // ChatBot
        public Dictionary<string, string>? ExtractedInfo { get; set;}
        public bool isInfoComplete { get; set;}
        public string? ErrorDetail { get; set; }
    }

    public class ChatHistoryMessageDto
    {
        public string role { get; set; } = null!;
        public string message { get; set; } = null!;
        public DateTime timestamp { get; set; }
    }

    public class ChatHistoryResponse
    {
        public List<ChatHistoryMessageDto> messages { get; set; } = new();
    }
}