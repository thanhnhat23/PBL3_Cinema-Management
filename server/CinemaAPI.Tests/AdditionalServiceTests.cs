using System.Diagnostics;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Implementations;
using CinemaAPI.Tests.TestInfrastructure;
using Microsoft.EntityFrameworkCore;
using Xunit;
using LocationService = CinemaAPI.Services.Implementations.LocationService;

namespace CinemaAPI.Tests;

public class AdditionalServiceTests
{
    [Fact]
    public async Task AdminService_GetTotalsAndAggregations_Works()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();

        TestSeedData.SeedBaseCatalog(context);
        context.Movies.Add(TestSeedData.CreateMovie(2, "Movie B", MovieStatus.Upcoming, new DateTime(DateTime.UtcNow.Year, 2, 10), DateTime.UtcNow.AddDays(30)));
        context.Genres.Add(TestSeedData.CreateGenre(2, "Drama"));
        context.MovieGenres.Add(TestSeedData.CreateMovieGenre(2, 2));
        context.Users.AddRange(
            TestSeedData.CreateUser(userName: "admin1", email: "admin1@example.com", role: UserType.Admin),
            TestSeedData.CreateUser(userName: "staff1", email: "staff1@example.com", role: UserType.Staff));
        await context.SaveChangesAsync();

        var mongoContext = MongoDbContextFactory.CreateWithReviewCount(7);
        var service = new AdminService(context, mongoContext);

        Assert.Equal(2, await service.GetTotalMoviesAsync());
        Assert.Equal(1, await service.GetTotalActorsAsync());
        Assert.Equal(2, await service.GetTotalGenresAsync());
        Assert.Equal(7, await service.GetTotalReviewsAsync());

        var statuses = await service.GetTotalMoviesByStatusAsync();
        Assert.Contains(statuses, item => item.status == "released" && item.total == 1);
        Assert.Contains(statuses, item => item.status == "upcoming" && item.total == 1);
        Assert.Contains(statuses, item => item.status == "ended" && item.total == 0);

        var monthCounts = await service.GetTotalMoviesByMonthAsync();
        Assert.Equal(12, monthCounts.Count);
        Assert.Equal(1, monthCounts.First(item => item.month == 2).total);

        var genres = await service.GetTotalMoviesByGenreAsync();
        Assert.Contains(genres, item => item.genre == "Action" && item.movie == 1);
        Assert.Contains(genres, item => item.genre == "Drama" && item.movie == 1);

        var admins = await service.GetAdminsAsync();
        Assert.Single(admins);
        Assert.Equal(UserType.Admin, admins[0].role);
    }

    [Fact]
    public async Task CouponService_GenerateUniqueCode_ReturnsNonExistingCode()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();

        context.Coupons.Add(new Coupon
        {
            coupon_id = 1,
            code = "ABCDEFGH",
            type = DiscountType.Percentage,
            description = "desc",
            discountValue = 10,
            maxDiscountAmount = 100,
            minOrderValue = 50,
            startDate = DateTime.UtcNow,
            endDate = DateTime.UtcNow.AddDays(10),
            isHoliday = false,
        });
        await context.SaveChangesAsync();

        var service = new CouponService(context);
        var code = await service.GenerateUniqueCouponCodeAsync();

        Assert.Equal(8, code.Length);
        Assert.NotEqual("ABCDEFGH", code);
    }

    [Fact]
    public async Task InventoryService_AddUpdateDelete_Works()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        TestSeedData.SeedBaseCatalog(context);

        var service = new InventoryService(context);

        await service.AddInventory(TestSeedData.CreateInventory(1, 1));
        var item = await service.GetInventoryById(1, 1);
        Assert.NotNull(item);

        await service.UpdateInventory(1, 1, new InventoryUpdateRequest
        {
            quantity = 30,
        });

        var updated = await service.GetInventoryById(1, 1);
        Assert.Equal(30, updated!.quantity);
    }

    [Fact]
    public async Task ComboDetailService_AddUpdateDelete_Works()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        TestSeedData.SeedBaseCatalog(context);

        var service = new ComboDetailService(context);

        await service.AddComboDetail(TestSeedData.CreateComboDetail(1, 1));
        var item = await service.GetComboDetail(1, 1);
        Assert.NotNull(item);

        await service.UpdateComboDetail(1, 1, new ComboDetailUpdateRequest
        {
            quantity = 5,
        });

        var updated = await service.GetComboDetail(1, 1);
        Assert.Equal(5, updated!.quantity);

        await service.HardDeleteComboDetail(1, 1);
        var deleted = await service.GetComboDetail(1, 1);
        Assert.Null(deleted);
    }

    [Fact]
    public async Task BookingService_CreateBookingWithCombo_AppliesDiscountAndDeductsCinemaInventory()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        TestSeedData.SeedBaseCatalog(context);

        var user = TestSeedData.CreateUser();
        var showtime = TestSeedData.CreateShowTime(id: 1, movieId: 1, roomId: 1);
        var comboSnack = TestSeedData.CreateSnack(id: 2, name: "Combo 1", type: SnackType.Combo);

        context.Users.Add(user);
        context.ShowTimes.Add(showtime);
        context.Snacks.Add(comboSnack);
        context.ComboDetails.Add(TestSeedData.CreateComboDetail(2, 1));
        context.Inventories.AddRange(
            TestSeedData.CreateInventory(snackId: 1, cinemaId: 1),
            TestSeedData.CreateInventory(snackId: 2, cinemaId: 1));
        await context.SaveChangesAsync();

        var service = new BookingService(context);

        var booking = await service.CreateBookingWithSnacksAsync(new BookingCreateRequest
        {
            user_id = user.user_id.ToString(),
            showtime_id = showtime.showtime_id,
            snacks = new List<BookingSnackRequest>
            {
                new() { snack_id = 2, quantity = 2 },
            },
        });

        Assert.Equal(200000m, booking.totalAmount);
        Assert.Equal(20000m, booking.discountAmount);
        Assert.Equal(180000m, booking.finalAmount);

        var popcornInventory = await context.Inventories.FirstAsync(item => item.snack_id == 1 && item.cinema_id == 1);
        Assert.Equal(11, popcornInventory.quantity);
    }

    [Fact]
    public async Task PaymentService_AddPayment_WithMissingBooking_Throws()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        var service = new PaymentService(context);

        await Assert.ThrowsAsync<ArgumentException>(() => service.AddPayment(TestSeedData.CreatePayment(1, 999)));
    }

    [Fact]
    public async Task PaymentService_AddUpdateDelete_Works()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        TestSeedData.SeedBookingData(context);

        var service = new PaymentService(context);

        await service.AddPayment(new Payment
        {
            booking_id = 1,
            amount = 120000,
            method = PaymentType.BankTransfer,
            status = PaymentStatus.Pending,
            provider = "Bank",
            transaction_code = "TXN-NEW",
            paidAt = DateTime.UtcNow,
        });

        var latestPayment = await context.Payments.OrderByDescending(item => item.payment_id).FirstAsync();

        await service.UpdatePayment(latestPayment.payment_id, new PaymentUpdateRequest
        {
            status = PaymentStatus.Success,
            provider = "Bank Updated",
        });

        var updated = await service.GetPaymentById(latestPayment.payment_id);
        Assert.Equal(PaymentStatus.Success, updated!.status);
        Assert.Equal("Bank Updated", updated.provider);

        await service.DeletePayment(latestPayment.payment_id);
        var deleted = await service.GetPaymentById(latestPayment.payment_id);
        Assert.Null(deleted);
    }

    [Fact]
    public async Task LocationService_AddUpdateDelete_Works()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();

        var service = new LocationService(context);

        await service.AddLocation(TestSeedData.CreateLocation(1, "Hue"));
        var locations = await service.GetLocationById(1);
        Assert.Single(locations);

        await service.UpdateLocation(1, new Location
        {
            city = "Da Nang"
        });

        var updated = await service.GetLocationById(1);
        Assert.Equal("Da Nang", updated[0]!.city);

        await service.DeleteLocation(1);
        var deleted = await service.GetLocationById(1);
        Assert.Empty(deleted);
    }

    [Fact]
    public async Task MovieService_GetMoviesByStatus_ReturnsExpectedItems()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        TestSeedData.SeedBaseCatalog(context);
        context.Movies.Add(TestSeedData.CreateMovie(2, "Upcoming Movie", MovieStatus.Upcoming));
        await context.SaveChangesAsync();

        var service = new MovieService(context);
        var releasedMovies = await service.GetMoviesByStatusAsync((int)MovieStatus.Released, 10);
        var upcomingMovies = await service.GetMoviesByStatusAsync((int)MovieStatus.Upcoming, 10);

        Assert.Single(releasedMovies);
        Assert.Single(upcomingMovies);
        Assert.Equal("Upcoming Movie", upcomingMovies[0].title);
    }

    [Fact]
    public async Task RoomService_AddRoom_PerformanceSanity()
    {
        using var factory = new SqliteTestDbContextFactory();
        await using var context = factory.CreateContext();
        TestSeedData.SeedBaseCatalog(context);

        var service = new RoomService(context);

        var stopwatch = Stopwatch.StartNew();
        await service.AddRoom(new Room
        {
            cinema_id = 1,
            nameRoom = "Perf Room",
            roomLayoutType = RoomLayoutType.Standard,
            price = 100000,
            row = 20,
            column = 20,
        });
        stopwatch.Stop();

        var seats = await context.Seats.CountAsync();
        Assert.Equal(400, seats);
        Assert.True(stopwatch.ElapsedMilliseconds < 5000, $"AddRoom took {stopwatch.ElapsedMilliseconds}ms");
    }
}