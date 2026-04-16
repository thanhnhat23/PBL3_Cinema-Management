using CinemaAPI.Models;
using CinemaAPI.data;

namespace CinemaAPI.Tests.TestInfrastructure;

internal static class TestSeedData
{
    public static Location CreateLocation(int id = 1, string city = "Da Nang") => new()
    {
        location_id = id,
        city = city,
    };

    public static Cinema CreateCinema(int locationId = 1, int id = 1, string name = "Cinema A") => new()
    {
        cinema_id = id,
        location_id = locationId,
        name = name,
        address = "123 Le Duan",
        latitude = 16.0544m,
        longitude = 108.2022m,
        phone_number = "0900000000",
        description = "Cinema description",
        image_overview = "image.jpg",
    };

    public static Room CreateRoom(int cinemaId = 1, int id = 1, string name = "Room 1", int row = 2, int column = 3) => new()
    {
        room_id = id,
        cinema_id = cinemaId,
        nameRoom = name,
        roomLayoutType = RoomLayoutType.Standard,
        price = 100000,
        row = row,
        column = column,
    };

    public static Snack CreateSnack(int id = 1, string name = "Popcorn", SnackType type = SnackType.Food) => new()
    {
        snack_id = id,
        name = name,
        type = type,
        price = 50000,
        imageUrl = "snack.jpg",
    };

    public static Genre CreateGenre(int id = 1, string name = "Action") => new()
    {
        genre_id = id,
        name = name,
    };

    public static Actor CreateActor(int id = 1, string name = "Actor A") => new()
    {
        actor_id = id,
        name = name,
        biography = "Bio",
        place_of_birth = "Da Nang",
        profile_path = "actor.jpg",
        gender = ActorGender.Male,
        birthday = new DateOnly(1990, 1, 1),
    };

    public static Movie CreateMovie(int id = 1, string title = "Movie A", MovieStatus status = MovieStatus.Released, DateTime? releaseDate = null, DateTime? endDate = null) => new()
    {
        movie_id = id,
        title = title,
        overview = "A great movie overview",
        release_date = releaseDate ?? DateTime.UtcNow.AddDays(-10),
        end_date = endDate ?? DateTime.UtcNow.AddDays(20),
        backdrop_path = "backdrop.jpg",
        poster_path = "poster.jpg",
        vote_average = 8.5,
        vote_count = 10,
        trailer_url = "trailer.mp4",
        runtime = 120,
        status = status,
    };

    public static ShowTime CreateShowTime(int id = 1, int movieId = 1, int roomId = 1) => new()
    {
        showtime_id = id,
        movie_id = movieId,
        room_id = roomId,
        startTime = DateTime.UtcNow.AddDays(1),
        endTime = DateTime.UtcNow.AddDays(1).AddHours(2),
    };

    public static User CreateUser(Guid? id = null, string userName = "admin", string email = "admin@example.com", UserType role = UserType.Admin, bool isVerified = true) => new()
    {
        user_id = id ?? Guid.NewGuid(),
        userName = userName,
        email = email,
        passwordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
        birthDate = new DateTime(1995, 1, 1),
        role = role,
        isEmailVerified = isVerified,
    };

    public static Booking CreateBooking(int id = 1, Guid? userId = null, int showtimeId = 1, BookingStatus status = BookingStatus.Pending) => new()
    {
        booking_id = id,
        user_id = userId ?? Guid.NewGuid(),
        showtime_id = showtimeId,
        totalAmount = 200000,
        finalAmount = 180000,
        discountAmount = 20000,
        status = status,
    };

    public static Payment CreatePayment(int id = 1, int bookingId = 1) => new()
    {
        payment_id = id,
        booking_id = bookingId,
        amount = 180000,
        method = PaymentType.CreditCard,
        status = PaymentStatus.Success,
        provider = "Stripe",
        transaction_code = "TXN123",
        paidAt = DateTime.UtcNow,
    };

    public static ComboDetail CreateComboDetail(int id = 1, int snackId = 1) => new()
    {
        combo_id = id,
        snack_id = snackId,
        quantity = 2,
    };

    public static Inventory CreateInventory(int snackId = 1, int cinemaId = 1) => new()
    {
        snack_id = snackId,
        cinema_id = cinemaId,
        quantity = 15,
    };

    public static MovieActor CreateMovieActor(int movieId = 1, int actorId = 1) => new()
    {
        movie_id = movieId,
        actor_id = actorId,
        char_name = "Hero",
        order = 1,
    };

    public static MovieGenre CreateMovieGenre(int movieId = 1, int genreId = 1) => new()
    {
        movie_id = movieId,
        genre_id = genreId,
    };

    public static SeatType CreateSeatType(int id = 1, SeatEnum seatEnum = SeatEnum.Single) => new()
    {
        type_id = id,
        type_name = seatEnum,
    };

    public static void SeedBaseCatalog(AppDbContext context)
    {
        var location = CreateLocation();
        var cinema = CreateCinema(location.location_id);
        var room = CreateRoom(cinema.cinema_id);
        var snack = CreateSnack();
        var genre = CreateGenre();
        var actor = CreateActor();
        var movie = CreateMovie();
        var movieActor = CreateMovieActor(movie.movie_id, actor.actor_id);
        var movieGenre = CreateMovieGenre(movie.movie_id, genre.genre_id);
        var seatTypeSingle = CreateSeatType(1, SeatEnum.Single);
        var seatTypeCouple = CreateSeatType(2, SeatEnum.Couple);

        context.Locations.Add(location);
        context.Cinemas.Add(cinema);
        context.Rooms.Add(room);
        context.Snacks.Add(snack);
        context.Genres.Add(genre);
        context.Actors.Add(actor);
        context.Movies.Add(movie);
        context.MovieActors.Add(movieActor);
        context.MovieGenres.Add(movieGenre);
        context.SeatTypes.AddRange(seatTypeSingle, seatTypeCouple);
        context.SaveChanges();
    }

    public static void SeedBookingData(AppDbContext context)
    {
        SeedBaseCatalog(context);

        var user = CreateUser();
        var showTime = CreateShowTime(movieId: 1, roomId: 1);
        var booking = CreateBooking(userId: user.user_id, showtimeId: showTime.showtime_id);
        var payment = CreatePayment(bookingId: booking.booking_id);

        context.Users.Add(user);
        context.ShowTimes.Add(showTime);
        context.Bookings.Add(booking);
        context.Payments.Add(payment);
        context.SaveChanges();
    }
}