using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace CinemaAPI.Models
{
    public class ChatSession
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? session_id { get; set; }

        [BsonElement("user_id")]
        public Guid user_id { get; set; }

        [BsonElement("status")]
        public string status { get; set; } = "active"; // active or closed

        // Information extracted from user to assist
        [BsonElement("extracted_info")]
        public Dictionary<string, string> extracted_info { get; set; } = new(); // movie name, cinema, date,...
        [BsonElement("messages")]
        public List<ChatMessage> messages { get; set; } = new();

        [BsonElement("createdAt")]
        [JsonConverter(typeof(TmdbService.DateTimeConverter))]
        public DateTime createdAt { get; set; } = DateTime.UtcNow;
    }

    public class ChatMessage
    {
        public string role { get; set; } = null!; // "user" or "assistant"
        public string message { get; set; } = null!;

        [JsonConverter(typeof(TmdbService.DateTimeConverter))]
        public DateTime timestamp { get; set; } = DateTime.UtcNow;
        public DateOnly? deleted_at { get; set; }
    }
}