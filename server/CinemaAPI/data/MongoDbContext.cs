using MongoDB.Driver;
using MongoDB.Bson.Serialization;
using MongoDB.Bson;
using CinemaAPI.Models;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    static MongoDbContext()
    {
        // Configure Guid serialization for MongoDB
        var guidSerializer = new MongoDB.Bson.Serialization.Serializers.GuidSerializer(GuidRepresentation.Standard);
        BsonSerializer.RegisterSerializer(guidSerializer);
    }

    public MongoDbContext(IConfiguration config)
    {
        var client = new MongoClient(config.GetConnectionString("CinemaMongoDB"));
        _database = client.GetDatabase("CinemaDb");
    }
    public IMongoCollection<Review> Reviews => _database.GetCollection<Review>("Reviews");

    public IMongoCollection<ChatSession> ChatSessions => _database.GetCollection<ChatSession>("ChatSessions");
}