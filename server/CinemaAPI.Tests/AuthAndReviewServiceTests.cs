using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Implementations;
using CinemaAPI.Services.Interfaces;
using CinemaAPI.Tests.TestInfrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Moq;
using Xunit;

namespace CinemaAPI.Tests;

public class AuthAndReviewServiceTests
{
    private static IConfiguration BuildAuthConfiguration()
    {
        return new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "this-is-a-very-strong-test-jwt-key-12345",
                ["Jwt:Issuer"] = "CinemaAPI.Tests",
                ["Jwt:Audience"] = "CinemaAPI.Tests.Client",
                ["App:BaseUrl"] = "http://localhost:3000"
            })
            .Build();
    }

    private static IOptions<CloudinaryConfig> BuildCloudinaryOptions()
    {
        return Options.Create(new CloudinaryConfig
        {
            CloudName = "test-cloud",
            ApiKey = "test-key",
            ApiSecret = "test-secret",
        });
    }

    [Fact]
    public async Task AuthService_Register_NewUser_SavesAndSendsVerificationEmail()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        var emailService = new Mock<IEmailService>();

        var service = new AuthService(context, BuildAuthConfiguration(), emailService.Object, BuildCloudinaryOptions());

        var result = await service.RegisterAsync(new RegisterRequest(
            userName: "new-user",
            email: "new-user@example.com",
            password: "Password123!",
            role: "User",
            birthDate: new DateTime(2000, 1, 1)),
            role: null);

        var user = await context.Users.FirstOrDefaultAsync(item => item.email == "new-user@example.com");

        Assert.True(result);
        Assert.NotNull(user);
        Assert.False(user!.isEmailVerified);
        Assert.False(string.IsNullOrWhiteSpace(user.verificationToken));
        emailService.Verify(item => item.SendEmailVerificationAsync("new-user@example.com", It.IsAny<string>()), Times.Once);
    }

    [Fact]
    public async Task AuthService_Register_DuplicateEmail_Throws()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        context.Users.Add(TestSeedData.CreateUser(email: "dupe@example.com", userName: "dupe-user"));
        await context.SaveChangesAsync();

        var emailService = new Mock<IEmailService>();
        var service = new AuthService(context, BuildAuthConfiguration(), emailService.Object, BuildCloudinaryOptions());

        await Assert.ThrowsAsync<Exception>(() => service.RegisterAsync(new RegisterRequest(
            userName: "another",
            email: "dupe@example.com",
            password: "Password123!",
            role: "User",
            birthDate: new DateTime(2001, 1, 1)), null));
    }

    [Fact]
    public async Task AuthService_Login_ValidCredentials_ReturnsToken()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        var user = TestSeedData.CreateUser(email: "login@example.com", userName: "login-user", role: UserType.Admin, isVerified: true);
        user.passwordHash = BCrypt.Net.BCrypt.HashPassword("Password123!");
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var emailService = new Mock<IEmailService>();
        var service = new AuthService(context, BuildAuthConfiguration(), emailService.Object, BuildCloudinaryOptions());

        var response = await service.LoginAsync(new LoginRequest("login-user", "Password123!"));

        Assert.NotNull(response);
        Assert.Equal("login-user", response!.userName);
        Assert.False(string.IsNullOrWhiteSpace(response.token));
    }

    [Fact]
    public async Task AuthService_ForgotPassword_SetsResetTokenAndSendsEmail()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        var user = TestSeedData.CreateUser(email: "forgot@example.com", userName: "forgot-user");
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var emailService = new Mock<IEmailService>();
        var service = new AuthService(context, BuildAuthConfiguration(), emailService.Object, BuildCloudinaryOptions());

        var result = await service.ForgotPasswordAsync(new ForgotPasswordRequest("forgot@example.com"));
        var updatedUser = await context.Users.FirstAsync(item => item.email == "forgot@example.com");

        Assert.True(result);
        Assert.False(string.IsNullOrWhiteSpace(updatedUser.passwordResetToken));
        Assert.True(updatedUser.resetTokenExpires > DateTime.UtcNow);
        emailService.Verify(item => item.SendResetPasswordEmailAsync("forgot@example.com", It.IsAny<string>()), Times.Once);
    }

    [Fact]
    public async Task AuthService_ChangePassword_UpdatesPasswordHash()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        var user = TestSeedData.CreateUser(email: "changepass@example.com", userName: "changepass-user");
        user.passwordHash = BCrypt.Net.BCrypt.HashPassword("OldPassword123!");
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var emailService = new Mock<IEmailService>();
        var service = new AuthService(context, BuildAuthConfiguration(), emailService.Object, BuildCloudinaryOptions());

        var result = await service.ChangePasswordAsync(new ChangePasswordRequest("OldPassword123!", "NewPassword123!"), user.user_id);
        var updated = await context.Users.FirstAsync(item => item.user_id == user.user_id);

        Assert.True(result);
        Assert.True(BCrypt.Net.BCrypt.Verify("NewPassword123!", updated.passwordHash));
    }

    [Fact]
    public async Task ReviewService_AddReview_ValidRequest_InsertsAndIncrementsVoteCount()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        var user = TestSeedData.CreateUser();
        var movie = TestSeedData.CreateMovie();
        context.Users.Add(user);
        context.Movies.Add(movie);
        await context.SaveChangesAsync();

        var insertedReviews = new List<Review>();
        var reviewCollectionMock = new Mock<IMongoCollection<Review>>();
        reviewCollectionMock
            .Setup(collection => collection.InsertOneAsync(It.IsAny<Review>(), It.IsAny<InsertOneOptions>(), It.IsAny<CancellationToken>()))
            .Callback<Review, InsertOneOptions?, CancellationToken>((review, _, _) => insertedReviews.Add(review))
            .Returns(Task.CompletedTask);

        var oldVoteCount = movie.vote_count;

        var mongoContext = MongoDbContextFactory.CreateWithReviewCollection(reviewCollectionMock.Object);
        var service = new ReviewService(context, mongoContext);

        await service.AddReview(new ReviewCreateRequest
        {
            user_id = user.user_id,
            movie_id = movie.movie_id,
            content = "Great movie",
            rating = 9,
        });

        var updatedMovie = await context.Movies.FirstAsync(item => item.movie_id == movie.movie_id);

        Assert.Single(insertedReviews);
        Assert.Equal("Great movie", insertedReviews[0].comment);
        Assert.Equal(oldVoteCount + 1, updatedMovie.vote_count);
    }

    [Fact]
    public async Task ReviewService_AddReview_InvalidRating_Throws()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();

        var reviewCollectionMock = new Mock<IMongoCollection<Review>>();
        var mongoContext = MongoDbContextFactory.CreateWithReviewCollection(reviewCollectionMock.Object);
        var service = new ReviewService(context, mongoContext);

        await Assert.ThrowsAsync<Exception>(() => service.AddReview(new ReviewCreateRequest
        {
            user_id = Guid.NewGuid(),
            movie_id = 1,
            content = "Bad",
            rating = 15,
        }));
    }

    [Fact]
    public async Task ReviewService_UpdateReview_InvalidRating_Throws()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();

        var reviewCollectionMock = new Mock<IMongoCollection<Review>>();
        var mongoContext = MongoDbContextFactory.CreateWithReviewCollection(reviewCollectionMock.Object);
        var service = new ReviewService(context, mongoContext);

        await Assert.ThrowsAsync<Exception>(() => service.UpdateReview("review-1", new ReviewUpdateRequest
        {
            rating = 11,
        }));
    }

    [Fact]
    public async Task ReviewService_BannedReview_NotFound_Throws()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();

        var reviewCollectionMock = new Mock<IMongoCollection<Review>>();
        reviewCollectionMock
            .Setup(collection => collection.UpdateOneAsync(
                It.IsAny<FilterDefinition<Review>>(),
                It.IsAny<UpdateDefinition<Review>>(),
                It.IsAny<UpdateOptions>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(new UpdateResult.Acknowledged(0, 0, null));

        var mongoContext = MongoDbContextFactory.CreateWithReviewCollection(reviewCollectionMock.Object);
        var service = new ReviewService(context, mongoContext);

        await Assert.ThrowsAsync<Exception>(() => service.BannedReview("review-404"));
    }
}