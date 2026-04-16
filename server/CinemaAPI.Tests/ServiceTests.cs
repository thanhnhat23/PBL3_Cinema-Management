using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Implementations;
using CinemaAPI.Tests.TestInfrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Xunit;
using GenericService = CinemaAPI.Services.Implementations.Service;
using LocationService = CinemaAPI.Services.Interfaces.LocationService;

namespace CinemaAPI.Tests;

public class ServiceTests
{
    [Fact]
    public async Task GetRoomsAsync_ReturnsFormattedRoomData()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        TestSeedData.SeedBaseCatalog(context);

        var service = new GenericService(context, new MemoryCache(new MemoryCacheOptions()));

        var result = await service.GetRoomsAsync();

        Assert.Contains("Rạp: Cinema A", result);
        Assert.Contains("Phòng: Room 1", result);
        Assert.Contains("Giá vé: 100000", result);
    }

    [Fact]
    public async Task GetSnacksAsync_ReturnsFormattedSnackData()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        TestSeedData.SeedBaseCatalog(context);

        var service = new GenericService(context, new MemoryCache(new MemoryCacheOptions()));

        var result = await service.GetSnacksAsync();

        Assert.Contains("Tên món: Popcorn", result);
        Assert.Contains("Loại: Food", result);
    }

    [Fact]
    public async Task GetMoviesAsync_ReturnsReleasedAndUpcomingMovies()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        TestSeedData.SeedBaseCatalog(context);

        var service = new GenericService(context, new MemoryCache(new MemoryCacheOptions()));

        var result = await service.GetMoviesAsync();

        Assert.Contains("Phim: Movie A", result);
        Assert.Contains("Thể loại: Action", result);
        Assert.Contains("Diễn viên: Actor A", result);
    }

    [Fact]
    public async Task GetGenresAsync_ReturnsAllGenres()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        TestSeedData.SeedBaseCatalog(context);

        var service = new GenericService(context, new MemoryCache(new MemoryCacheOptions()));

        var result = await service.GetGenresAsync();

        Assert.Contains("Tên thể loại: Action", result);
    }

    [Fact]
    public async Task GetActorsAsync_ReturnsActors()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        TestSeedData.SeedBaseCatalog(context);

        var service = new GenericService(context, new MemoryCache(new MemoryCacheOptions()));

        var result = await service.GetActorsAsync();

        Assert.Contains("Tên diễn viên: Actor A", result);
        Assert.Contains("Nơi sinh: Da Nang", result);
    }

    [Fact]
    public async Task ActorService_GetActorAndUpdate_Works()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        TestSeedData.SeedBaseCatalog(context);

        var service = new ActorService(context);

        var actor = await service.GetActorByIdAsync(1);
        Assert.NotNull(actor);
        Assert.Equal("Actor A", actor!.name);

        await service.UpdateActorAsync(1, new ActorDetailRequest
        {
            biography = "Updated bio",
            place_of_birth = "HCMC"
        });

        var updated = await service.GetActorByIdAsync(1);
        Assert.Equal("Updated bio", updated!.biography);
        Assert.Equal("HCMC", updated.place_of_birth);
    }

    [Fact]
    public async Task BookingService_AddUpdateDelete_Works()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        TestSeedData.SeedBookingData(context);

        var service = new BookingService(context);

        var booking = await service.GetBookingById(1);
        Assert.NotNull(booking);

        await service.UpdateBooking(1, new BookingUpdateRequest
        {
            totalAmount = 250000,
            finalAmount = 230000,
            status = BookingStatus.Confirmed
        });

        var updated = await service.GetBookingById(1);
        Assert.Equal(250000, updated!.totalAmount);
        Assert.Equal(BookingStatus.Confirmed, updated.status);

        await service.DeleteBooking(1);
        var deleted = await service.GetBookingById(1);
        Assert.Null(deleted);
    }

    [Fact]
    public async Task CinemaService_AddUpdateDelete_Works()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        TestSeedData.SeedBaseCatalog(context);

        var service = new CinemaService(context);

        await service.AddCinema(new CinemaCreateRequest
        {
            location_id = 1,
            name = "Cinema B",
            address = "456 Tran Hung Dao",
            phone_number = "0911111111",
            latitude = 16.1m,
            longitude = 108.3m,
            description = "New cinema",
            image_overview = "cinema-b.jpg"
        });

        var cinema = await service.GetCinemaById(2);
        Assert.NotNull(cinema);
        Assert.Equal("Cinema B", cinema!.name);

        await service.UpdateCinema(2, new CinemaUpdateRequest
        {
            location_id = 1,
            name = "Cinema B Updated",
            address = "789 Le Loi",
            phone_number = "0922222222",
            latitude = 16.2m,
            longitude = 108.4m,
            description = "Updated cinema",
            image_overview = "cinema-b-updated.jpg"
        });

        var updated = await service.GetCinemaById(2);
        Assert.Equal("Cinema B Updated", updated!.name);

        await service.DeleteCinema(2);
        var deleted = await service.GetCinemaById(2);
        Assert.Null(deleted);
    }

    [Fact]
    public async Task UserService_BanUser_Works()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        var user = TestSeedData.CreateUser(role: UserType.User);
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var service = new UserService(context);

        await service.BannedUser(user.user_id, true);

        var updated = await service.GetUserById(user.user_id);
        Assert.True(updated!.isBanned);
    }

    [Fact]
    public async Task MovieService_GetPopularMovies_ReturnsMostShownFirst()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        TestSeedData.SeedBaseCatalog(context);

        var secondMovie = TestSeedData.CreateMovie(2, "Movie B", MovieStatus.Released, DateTime.UtcNow.AddDays(-5), DateTime.UtcNow.AddDays(25));
        context.Movies.Add(secondMovie);
        context.ShowTimes.AddRange(
            TestSeedData.CreateShowTime(1, 1, 1),
            TestSeedData.CreateShowTime(2, 1, 1),
            TestSeedData.CreateShowTime(3, 2, 1));
        await context.SaveChangesAsync();

        var service = new MovieService(context);

        var popularMovies = await service.GetPopularMoviesAsync(2);

        Assert.Equal("Movie A", popularMovies[0].title);
        Assert.Equal("Movie B", popularMovies[1].title);
    }

    [Fact]
    public async Task RoomService_AddRoom_CreatesExpectedSeats()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        TestSeedData.SeedBaseCatalog(context);

        var service = new RoomService(context);

        await service.AddRoom(new Room
        {
            cinema_id = 1,
            nameRoom = "Room 2",
            roomLayoutType = RoomLayoutType.IMAX,
            price = 150000,
            row = 2,
            column = 3,
        });

        var seats = await context.Seats.CountAsync();
        Assert.Equal(6, seats);
    }

    [Fact]
    public async Task RoomService_UpdateRoom_Works()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        TestSeedData.SeedBaseCatalog(context);

        var service = new RoomService(context);

        await service.UpdateRoom(1, new RoomUpdateRequest
        {
            nameRoom = "Updated Room",
            roomLayoutType = RoomLayoutType.ThreeD,
            price = 180000
        });

        var room = await service.GetRoomById(1);
        Assert.Equal("Updated Room", room!.nameRoom);
        Assert.Equal(RoomLayoutType.ThreeD, room.roomLayoutType);
        Assert.Equal(180000, room.price);
    }
}