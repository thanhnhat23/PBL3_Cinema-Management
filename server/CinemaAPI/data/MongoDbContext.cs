using MongoDB.Driver;
using CinemaAPI.Models;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;
    public MongoDbContext(IConfiguration config)
    {
        var client = new MongoClient(config.GetConnectionString("CinemaMongoDB"));
        _database = client.GetDatabase("CinemaDb");
    }
    public IMongoCollection<Review> Reviews => _database.GetCollection<Review>("Reviews");
}