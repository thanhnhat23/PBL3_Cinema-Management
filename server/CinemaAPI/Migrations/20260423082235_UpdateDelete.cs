using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CinemaAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "UserVouchers",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "Snacks",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "ShowTimeSeats",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "ShowTimes",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "ShowTimePrices",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "SeatTypes",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "Seats",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "Rooms",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "PointTransactions",
                type: "date",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "refundAt",
                table: "Payments",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "Payments",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "Movies",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "MovieGenres",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "MovieActors",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "Locations",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "Inventories",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "Genres",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "Coupons",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "ComboDetails",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "Cinemas",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "BookingSnacks",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "Bookings",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "Actors",
                type: "date",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "UserVouchers");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Snacks");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "ShowTimeSeats");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "ShowTimes");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "ShowTimePrices");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "SeatTypes");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Seats");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "PointTransactions");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "MovieGenres");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "MovieActors");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Inventories");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Genres");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Coupons");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "ComboDetails");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Cinemas");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "BookingSnacks");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Actors");

            migrationBuilder.AlterColumn<DateTime>(
                name: "refundAt",
                table: "Payments",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)");
        }
    }
}
