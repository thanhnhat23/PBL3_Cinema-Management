using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace CinemaAPI.Models
{
    public class Review
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? review_id { get; set; }

        [BsonElement("movie_id")]
        public int movie_id { get; set; }

        [BsonElement("user_id")]
        public Guid? user_id { get; set; }

        [BsonElement("username")]
        public string username { get; set; } = null!;

        [BsonElement("profile_slug")]
        public string profile_slug { get; set; } = "tmdb-user";

        [BsonElement("avatar_provider")]
        public string avatar_provider { get; set; } = "tmdb";

        public string? avatar_path { get; set; } = null!;
        
        public string comment { get; set;} = null!;
        public double rating { get; set; }
        public bool isApproved { get; set;} = true;
        public bool spoilerFlag { get; set; } = false;

        [JsonConverter(typeof(TmdbService.DateTimeConverter))]
        public DateTime createAt { get; set; } = DateTime.UtcNow;

        [JsonConverter(typeof(TmdbService.DateTimeConverter))]
        public DateTime updatedAt { get; set;} = DateTime.UtcNow;
    }
}