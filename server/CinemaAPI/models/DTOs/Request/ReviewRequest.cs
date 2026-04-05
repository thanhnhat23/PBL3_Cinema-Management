using System.Text.Json.Serialization;

namespace CinemaAPI.Models.DTOs
{
    public class ReviewCreateRequest
    {
        [JsonPropertyName("user_id")]
        public Guid user_id { get; set; }

        [JsonPropertyName("movie_id")]
        public int movie_id { get; set; }

        [JsonPropertyName("content")]
        public string content { get; set; } = null!;

        [JsonPropertyName("rating")]
        public int rating { get; set; }
    }

    public class ReviewUpdateRequest
    {
        [JsonPropertyName("content")]
        public string? content { get; set; }

        [JsonPropertyName("rating")]
        public int? rating { get; set; }
    }
}