namespace CinemaAPI.Models.DTOs
{
    public class ChatRequest
    {
        public string message { get; set; } = null!; // The user's message to the chatbot
    }

    public class ChatResponse
    {
        public string reply { get; set;} = null!; // The chatbot's reply message
        public Dictionary<string, string>? ExtractedInfo { get; set;}
        public bool isInfoComplete { get; set;}
    }
}