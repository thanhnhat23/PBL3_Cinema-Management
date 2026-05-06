using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CinemaAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Actors",
                columns: table => new
                {
                    actor_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    biography = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    place_of_birth = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    profile_path = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    gender = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    birthday = table.Column<DateOnly>(type: "date", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_by = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Actors", x => x.actor_id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "BlacklistedTokens",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Token = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ExpiryDate = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlacklistedTokens", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Coupons",
                columns: table => new
                {
                    coupon_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    code = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    description = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    type = table.Column<int>(type: "int", nullable: false),
                    discountValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    maxDiscountAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    minOrderValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    startDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    endDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    isHoliday = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    applies_to = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_by = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coupons", x => x.coupon_id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Genres",
                columns: table => new
                {
                    genre_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Genres", x => x.genre_id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Locations",
                columns: table => new
                {
                    location_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    city = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_by = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locations", x => x.location_id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Movies",
                columns: table => new
                {
                    movie_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    tmdb_id = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    adult = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    title = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    overview = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    release_date = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    end_date = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    backdrop_path = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    poster_path = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    vote_average = table.Column<double>(type: "double", nullable: false),
                    vote_count = table.Column<int>(type: "int", nullable: false),
                    trailer_url = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    runtime = table.Column<int>(type: "int", nullable: false),
                    status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_by = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movies", x => x.movie_id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SeatTypes",
                columns: table => new
                {
                    type_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    type_name = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SeatTypes", x => x.type_id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ShowTimeSlots",
                columns: table => new
                {
                    slot_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    dayOfWeek = table.Column<int>(type: "int", nullable: false),
                    startTime = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                    endTime = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                    reusable = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    status = table.Column<int>(type: "int", nullable: false),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_by = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShowTimeSlots", x => x.slot_id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Snacks",
                columns: table => new
                {
                    snack_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    type = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    imageUrl = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_by = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Snacks", x => x.snack_id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    user_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    userName = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    passwordHash = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    birthDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    avatar_path = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    isBanned = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    role = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    createAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    passwordResetToken = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    resetTokenExpires = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    isEmailVerified = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    verificationToken = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    verificationTokenExpires = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.user_id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Cinemas",
                columns: table => new
                {
                    cinema_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    location_id = table.Column<int>(type: "int", nullable: false),
                    name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    address = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    latitude = table.Column<decimal>(type: "decimal(18,10)", nullable: false),
                    longitude = table.Column<decimal>(type: "decimal(18,10)", nullable: false),
                    phone_number = table.Column<string>(type: "varchar(15)", maxLength: 15, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    description = table.Column<string>(type: "varchar(5000)", maxLength: 5000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    image_overview = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_by = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cinemas", x => x.cinema_id);
                    table.ForeignKey(
                        name: "FK_Cinemas_Locations_location_id",
                        column: x => x.location_id,
                        principalTable: "Locations",
                        principalColumn: "location_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MovieActors",
                columns: table => new
                {
                    movie_id = table.Column<int>(type: "int", nullable: false),
                    actor_id = table.Column<int>(type: "int", nullable: false),
                    char_name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    order = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovieActors", x => new { x.movie_id, x.actor_id });
                    table.ForeignKey(
                        name: "FK_MovieActors_Actors_actor_id",
                        column: x => x.actor_id,
                        principalTable: "Actors",
                        principalColumn: "actor_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MovieActors_Movies_movie_id",
                        column: x => x.movie_id,
                        principalTable: "Movies",
                        principalColumn: "movie_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MovieGenres",
                columns: table => new
                {
                    movie_id = table.Column<int>(type: "int", nullable: false),
                    genre_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovieGenres", x => new { x.movie_id, x.genre_id });
                    table.ForeignKey(
                        name: "FK_MovieGenres_Genres_genre_id",
                        column: x => x.genre_id,
                        principalTable: "Genres",
                        principalColumn: "genre_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MovieGenres_Movies_movie_id",
                        column: x => x.movie_id,
                        principalTable: "Movies",
                        principalColumn: "movie_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ComboDetails",
                columns: table => new
                {
                    combo_id = table.Column<int>(type: "int", nullable: false),
                    snack_id = table.Column<int>(type: "int", nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_by = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComboDetails", x => new { x.combo_id, x.snack_id });
                    table.ForeignKey(
                        name: "FK_ComboDetails_Snacks_combo_id",
                        column: x => x.combo_id,
                        principalTable: "Snacks",
                        principalColumn: "snack_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ComboDetails_Snacks_snack_id",
                        column: x => x.snack_id,
                        principalTable: "Snacks",
                        principalColumn: "snack_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "UserVouchers",
                columns: table => new
                {
                    user_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    coupon_id = table.Column<int>(type: "int", nullable: false),
                    isUsed = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    usedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    assignedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserVouchers", x => new { x.user_id, x.coupon_id });
                    table.ForeignKey(
                        name: "FK_UserVouchers_Coupons_coupon_id",
                        column: x => x.coupon_id,
                        principalTable: "Coupons",
                        principalColumn: "coupon_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserVouchers_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Inventories",
                columns: table => new
                {
                    snack_id = table.Column<int>(type: "int", nullable: false),
                    cinema_id = table.Column<int>(type: "int", nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inventories", x => new { x.snack_id, x.cinema_id });
                    table.ForeignKey(
                        name: "FK_Inventories_Cinemas_cinema_id",
                        column: x => x.cinema_id,
                        principalTable: "Cinemas",
                        principalColumn: "cinema_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Inventories_Snacks_snack_id",
                        column: x => x.snack_id,
                        principalTable: "Snacks",
                        principalColumn: "snack_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    room_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    cinema_id = table.Column<int>(type: "int", nullable: false),
                    nameRoom = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    roomLayoutType = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    row = table.Column<int>(type: "int", nullable: false),
                    column = table.Column<int>(type: "int", nullable: false),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_by = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.room_id);
                    table.ForeignKey(
                        name: "FK_Rooms_Cinemas_cinema_id",
                        column: x => x.cinema_id,
                        principalTable: "Cinemas",
                        principalColumn: "cinema_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Seats",
                columns: table => new
                {
                    seat_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    room_id = table.Column<int>(type: "int", nullable: false),
                    type_id = table.Column<int>(type: "int", nullable: false),
                    row_index = table.Column<int>(type: "int", nullable: false),
                    column_index = table.Column<int>(type: "int", nullable: false),
                    seat_code = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seats", x => x.seat_id);
                    table.ForeignKey(
                        name: "FK_Seats_Rooms_room_id",
                        column: x => x.room_id,
                        principalTable: "Rooms",
                        principalColumn: "room_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Seats_SeatTypes_type_id",
                        column: x => x.type_id,
                        principalTable: "SeatTypes",
                        principalColumn: "type_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ShowTimes",
                columns: table => new
                {
                    showtime_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    room_id = table.Column<int>(type: "int", nullable: false),
                    movie_id = table.Column<int>(type: "int", nullable: false),
                    slot_id = table.Column<int>(type: "int", nullable: true),
                    pricing_model = table.Column<int>(type: "int", nullable: false),
                    startTime = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    endTime = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_by = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShowTimes", x => x.showtime_id);
                    table.ForeignKey(
                        name: "FK_ShowTimes_Movies_movie_id",
                        column: x => x.movie_id,
                        principalTable: "Movies",
                        principalColumn: "movie_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ShowTimes_Rooms_room_id",
                        column: x => x.room_id,
                        principalTable: "Rooms",
                        principalColumn: "room_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ShowTimes_ShowTimeSlots_slot_id",
                        column: x => x.slot_id,
                        principalTable: "ShowTimeSlots",
                        principalColumn: "slot_id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    booking_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    user_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    showtime_id = table.Column<int>(type: "int", nullable: false),
                    coupon_id = table.Column<int>(type: "int", nullable: true),
                    totalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    discountAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    finalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    createAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x.booking_id);
                    table.ForeignKey(
                        name: "FK_Bookings_Coupons_coupon_id",
                        column: x => x.coupon_id,
                        principalTable: "Coupons",
                        principalColumn: "coupon_id");
                    table.ForeignKey(
                        name: "FK_Bookings_ShowTimes_showtime_id",
                        column: x => x.showtime_id,
                        principalTable: "ShowTimes",
                        principalColumn: "showtime_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Bookings_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ShowTimePrices",
                columns: table => new
                {
                    type_id = table.Column<int>(type: "int", nullable: false),
                    showtime_id = table.Column<int>(type: "int", nullable: false),
                    base_price = table.Column<decimal>(type: "decimal(65,30)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShowTimePrices", x => new { x.type_id, x.showtime_id });
                    table.ForeignKey(
                        name: "FK_ShowTimePrices_SeatTypes_type_id",
                        column: x => x.type_id,
                        principalTable: "SeatTypes",
                        principalColumn: "type_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ShowTimePrices_ShowTimes_showtime_id",
                        column: x => x.showtime_id,
                        principalTable: "ShowTimes",
                        principalColumn: "showtime_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "BookingSnacks",
                columns: table => new
                {
                    booking_id = table.Column<int>(type: "int", nullable: false),
                    snack_id = table.Column<int>(type: "int", nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false),
                    price = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingSnacks", x => new { x.booking_id, x.snack_id });
                    table.ForeignKey(
                        name: "FK_BookingSnacks_Bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "Bookings",
                        principalColumn: "booking_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookingSnacks_Snacks_snack_id",
                        column: x => x.snack_id,
                        principalTable: "Snacks",
                        principalColumn: "snack_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    payment_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    booking_id = table.Column<int>(type: "int", nullable: false),
                    amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    method = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    vnp_BankCode = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    vnp_TransactionNo = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    vnp_IpAddr = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    vnp_TxnRef = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    vnp_ResponseCode = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    vnp_OrderInfo = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    vnp_SecureHash = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    vnp_CreateDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    vnp_ExpireDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    paid_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    refund_code = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    refund_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.payment_id);
                    table.ForeignKey(
                        name: "FK_Payments_Bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "Bookings",
                        principalColumn: "booking_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PointTransactions",
                columns: table => new
                {
                    transaction_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    user_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    booking_id = table.Column<int>(type: "int", nullable: false),
                    amount = table.Column<int>(type: "int", nullable: false),
                    type = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    occurredAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PointTransactions", x => x.transaction_id);
                    table.ForeignKey(
                        name: "FK_PointTransactions_Bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "Bookings",
                        principalColumn: "booking_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PointTransactions_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ShowTimeSeats",
                columns: table => new
                {
                    seat_id = table.Column<int>(type: "int", nullable: false),
                    showtime_id = table.Column<int>(type: "int", nullable: false),
                    stseat_id = table.Column<int>(type: "int", nullable: false),
                    booking_id = table.Column<int>(type: "int", nullable: true),
                    status = table.Column<int>(type: "int", nullable: false),
                    price_override = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RowVersion = table.Column<DateTime>(type: "timestamp(6)", rowVersion: true, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShowTimeSeats", x => new { x.showtime_id, x.seat_id });
                    table.ForeignKey(
                        name: "FK_ShowTimeSeats_Bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "Bookings",
                        principalColumn: "booking_id");
                    table.ForeignKey(
                        name: "FK_ShowTimeSeats_Seats_seat_id",
                        column: x => x.seat_id,
                        principalTable: "Seats",
                        principalColumn: "seat_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ShowTimeSeats_ShowTimes_showtime_id",
                        column: x => x.showtime_id,
                        principalTable: "ShowTimes",
                        principalColumn: "showtime_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Actors_name",
                table: "Actors",
                column: "name");

            migrationBuilder.CreateIndex(
                name: "IX_BlacklistedTokens_ExpiryDate",
                table: "BlacklistedTokens",
                column: "ExpiryDate");

            migrationBuilder.CreateIndex(
                name: "IX_BlacklistedTokens_Token",
                table: "BlacklistedTokens",
                column: "Token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_coupon_id",
                table: "Bookings",
                column: "coupon_id");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_createAt",
                table: "Bookings",
                column: "createAt");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_showtime_id",
                table: "Bookings",
                column: "showtime_id");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_status",
                table: "Bookings",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_user_id_createAt",
                table: "Bookings",
                columns: new[] { "user_id", "createAt" },
                descending: new[] { false, true });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_user_id_status",
                table: "Bookings",
                columns: new[] { "user_id", "status" });

            migrationBuilder.CreateIndex(
                name: "IX_BookingSnacks_snack_id",
                table: "BookingSnacks",
                column: "snack_id");

            migrationBuilder.CreateIndex(
                name: "IX_Cinemas_location_id",
                table: "Cinemas",
                column: "location_id");

            migrationBuilder.CreateIndex(
                name: "IX_Cinemas_name",
                table: "Cinemas",
                column: "name");

            migrationBuilder.CreateIndex(
                name: "IX_ComboDetails_snack_id",
                table: "ComboDetails",
                column: "snack_id");

            migrationBuilder.CreateIndex(
                name: "IX_Coupons_code",
                table: "Coupons",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Coupons_startDate_endDate",
                table: "Coupons",
                columns: new[] { "startDate", "endDate" });

            migrationBuilder.CreateIndex(
                name: "IX_Inventories_cinema_id",
                table: "Inventories",
                column: "cinema_id");

            migrationBuilder.CreateIndex(
                name: "IX_MovieActors_actor_id",
                table: "MovieActors",
                column: "actor_id");

            migrationBuilder.CreateIndex(
                name: "IX_MovieGenres_genre_id",
                table: "MovieGenres",
                column: "genre_id");

            migrationBuilder.CreateIndex(
                name: "IX_Movies_release_date_end_date",
                table: "Movies",
                columns: new[] { "release_date", "end_date" });

            migrationBuilder.CreateIndex(
                name: "IX_Movies_status",
                table: "Movies",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "IX_Movies_status_release_date",
                table: "Movies",
                columns: new[] { "status", "release_date" },
                descending: new[] { false, true });

            migrationBuilder.CreateIndex(
                name: "IX_Movies_title",
                table: "Movies",
                column: "title");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_booking_id",
                table: "Payments",
                column: "booking_id");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_status",
                table: "Payments",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_vnp_TransactionNo",
                table: "Payments",
                column: "vnp_TransactionNo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Payments_vnp_TxnRef",
                table: "Payments",
                column: "vnp_TxnRef",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PointTransactions_booking_id",
                table: "PointTransactions",
                column: "booking_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PointTransactions_user_id_occurredAt",
                table: "PointTransactions",
                columns: new[] { "user_id", "occurredAt" },
                descending: new[] { false, true });

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_cinema_id",
                table: "Rooms",
                column: "cinema_id");

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_roomLayoutType",
                table: "Rooms",
                column: "roomLayoutType");

            migrationBuilder.CreateIndex(
                name: "IX_Seats_room_id_seat_code",
                table: "Seats",
                columns: new[] { "room_id", "seat_code" });

            migrationBuilder.CreateIndex(
                name: "IX_Seats_type_id",
                table: "Seats",
                column: "type_id");

            migrationBuilder.CreateIndex(
                name: "IX_ShowTimePrices_showtime_id",
                table: "ShowTimePrices",
                column: "showtime_id");

            migrationBuilder.CreateIndex(
                name: "IX_ShowTimes_movie_id_startTime",
                table: "ShowTimes",
                columns: new[] { "movie_id", "startTime" });

            migrationBuilder.CreateIndex(
                name: "IX_ShowTimes_room_id_startTime",
                table: "ShowTimes",
                columns: new[] { "room_id", "startTime" });

            migrationBuilder.CreateIndex(
                name: "IX_ShowTimes_slot_id",
                table: "ShowTimes",
                column: "slot_id");

            migrationBuilder.CreateIndex(
                name: "IX_ShowTimes_startTime",
                table: "ShowTimes",
                column: "startTime");

            migrationBuilder.CreateIndex(
                name: "IX_ShowTimeSeats_booking_id",
                table: "ShowTimeSeats",
                column: "booking_id");

            migrationBuilder.CreateIndex(
                name: "IX_ShowTimeSeats_seat_id",
                table: "ShowTimeSeats",
                column: "seat_id");

            migrationBuilder.CreateIndex(
                name: "IX_ShowTimeSeats_showtime_id_seat_id",
                table: "ShowTimeSeats",
                columns: new[] { "showtime_id", "seat_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ShowTimeSeats_showtime_id_status",
                table: "ShowTimeSeats",
                columns: new[] { "showtime_id", "status" });

            migrationBuilder.CreateIndex(
                name: "IX_ShowTimeSlots_dayOfWeek",
                table: "ShowTimeSlots",
                column: "dayOfWeek");

            migrationBuilder.CreateIndex(
                name: "IX_Users_passwordResetToken",
                table: "Users",
                column: "passwordResetToken");

            migrationBuilder.CreateIndex(
                name: "IX_Users_role",
                table: "Users",
                column: "role");

            migrationBuilder.CreateIndex(
                name: "IX_Users_verificationToken",
                table: "Users",
                column: "verificationToken");

            migrationBuilder.CreateIndex(
                name: "IX_UserVouchers_coupon_id",
                table: "UserVouchers",
                column: "coupon_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BlacklistedTokens");

            migrationBuilder.DropTable(
                name: "BookingSnacks");

            migrationBuilder.DropTable(
                name: "ComboDetails");

            migrationBuilder.DropTable(
                name: "Inventories");

            migrationBuilder.DropTable(
                name: "MovieActors");

            migrationBuilder.DropTable(
                name: "MovieGenres");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "PointTransactions");

            migrationBuilder.DropTable(
                name: "ShowTimePrices");

            migrationBuilder.DropTable(
                name: "ShowTimeSeats");

            migrationBuilder.DropTable(
                name: "UserVouchers");

            migrationBuilder.DropTable(
                name: "Snacks");

            migrationBuilder.DropTable(
                name: "Actors");

            migrationBuilder.DropTable(
                name: "Genres");

            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.DropTable(
                name: "Seats");

            migrationBuilder.DropTable(
                name: "Coupons");

            migrationBuilder.DropTable(
                name: "ShowTimes");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "SeatTypes");

            migrationBuilder.DropTable(
                name: "Movies");

            migrationBuilder.DropTable(
                name: "Rooms");

            migrationBuilder.DropTable(
                name: "ShowTimeSlots");

            migrationBuilder.DropTable(
                name: "Cinemas");

            migrationBuilder.DropTable(
                name: "Locations");
        }
    }
}
