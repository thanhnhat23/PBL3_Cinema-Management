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
    }
}