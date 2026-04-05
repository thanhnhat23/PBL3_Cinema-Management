using System.Text.Json.Serialization;

namespace CinemaAPI.Models.DTOs
{
    public class ReviewResponse
    {
        [JsonPropertyName("results")]
        public List<ReviewItem> Results { get; set; } = new();
    }

    public class ReviewItem
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = null!;

        [JsonPropertyName("author")]
        public string author { get; set; } = null!;

        [JsonPropertyName("author_details")]
        public ReviewAuthorDetails? author_details { get; set; }

        [JsonPropertyName("content")]
        public string content { get; set; } = null!;

        [JsonPropertyName("created_at")]
        public DateTime created_at { get; set; }

        [JsonPropertyName("updated_at")]
        public DateTime updated_at { get; set; }
    }

    public class ReviewAuthorDetails
    {
        [JsonPropertyName("username")]
        public string? username { get; set; }

        [JsonPropertyName("rating")]
        public double? rating { get; set; }

        [JsonPropertyName("avatar_path")]
        public string? avatar_path { get; set; }
    }
}