using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Moq;
using CinemaAPI.Models;
using System.Reflection;
using System.Runtime.Serialization;

namespace CinemaAPI.Tests.TestInfrastructure;

internal static class MongoDbContextFactory
{
    public static MongoDbContext Create()
    {
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:CinemaMongoDB"] = "mongodb://localhost:27017"
            })
            .Build();

        return new MongoDbContext(config);
    }

    public static MongoDbContext CreateWithReviewCount(long reviewCount)
    {
        var reviewCollectionMock = new Mock<IMongoCollection<Review>>();
        reviewCollectionMock
            .Setup(collection => collection.CountDocumentsAsync(It.IsAny<FilterDefinition<Review>>(), It.IsAny<CountOptions?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(reviewCount);

        return CreateWithReviewCollection(reviewCollectionMock.Object);
    }

    public static MongoDbContext CreateWithReviewCollection(IMongoCollection<Review> reviewCollection)
    {
        var databaseMock = new Mock<IMongoDatabase>();
        databaseMock
            .Setup(database => database.GetCollection<Review>("Reviews", null))
            .Returns(reviewCollection);

        var context = (MongoDbContext)FormatterServices.GetUninitializedObject(typeof(MongoDbContext));
        var databaseField = typeof(MongoDbContext).GetField("_database", BindingFlags.NonPublic | BindingFlags.Instance);

        if (databaseField == null)
        {
            throw new InvalidOperationException("MongoDbContext._database field was not found.");
        }

        databaseField.SetValue(context, databaseMock.Object);
        return context;
    }
}