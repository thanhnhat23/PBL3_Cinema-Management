using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

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
        public Guid user_id { get; set; }

        [BsonIgnore]
        public string username { get; set; } = null!;
        
        public string comment { get; set;} = null!;
        public double rating { get; set; }
        public bool isApproved{ get; set;}
        public bool spoilerFlag { get; set; } = false;
        public DateTime createAt { get; set; } = DateTime.UtcNow;
        public DateTime updatedAt { get; set;}
    }
}