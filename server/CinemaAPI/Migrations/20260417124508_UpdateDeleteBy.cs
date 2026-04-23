using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CinemaAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDeleteBy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "UserVouchers");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "ShowTimeSeats");

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
                table: "PointTransactions");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "MovieGenres");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "MovieActors");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Inventories");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Genres");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "BookingSnacks");

            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "Bookings");

            migrationBuilder.AlterColumn<DateTime>(
                name: "deleted_at",
                table: "Snacks",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "deleted_by",
                table: "Snacks",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AlterColumn<DateTime>(
                name: "deleted_at",
                table: "ShowTimes",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "deleted_by",
                table: "ShowTimes",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AlterColumn<DateTime>(
                name: "deleted_at",
                table: "Rooms",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "deleted_by",
                table: "Rooms",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AlterColumn<DateTime>(
                name: "deleted_at",
                table: "Movies",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "deleted_by",
                table: "Movies",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AlterColumn<DateTime>(
                name: "deleted_at",
                table: "Locations",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "deleted_by",
                table: "Locations",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AlterColumn<DateTime>(
                name: "deleted_at",
                table: "Coupons",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "deleted_by",
                table: "Coupons",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AlterColumn<DateTime>(
                name: "deleted_at",
                table: "ComboDetails",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "deleted_by",
                table: "ComboDetails",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AlterColumn<DateTime>(
                name: "deleted_at",
                table: "Cinemas",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "deleted_by",
                table: "Cinemas",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AlterColumn<DateTime>(
                name: "deleted_at",
                table: "Actors",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "deleted_by",
                table: "Actors",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "deleted_by",
                table: "Snacks");

            migrationBuilder.DropColumn(
                name: "deleted_by",
                table: "ShowTimes");

            migrationBuilder.DropColumn(
                name: "deleted_by",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "deleted_by",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "deleted_by",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "deleted_by",
                table: "Coupons");

            migrationBuilder.DropColumn(
                name: "deleted_by",
                table: "ComboDetails");

            migrationBuilder.DropColumn(
                name: "deleted_by",
                table: "Cinemas");

            migrationBuilder.DropColumn(
                name: "deleted_by",
                table: "Actors");

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "UserVouchers",
                type: "date",
                nullable: true);

            migrationBuilder.AlterColumn<DateOnly>(
                name: "deleted_at",
                table: "Snacks",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "ShowTimeSeats",
                type: "date",
                nullable: true);

            migrationBuilder.AlterColumn<DateOnly>(
                name: "deleted_at",
                table: "ShowTimes",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true);

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

            migrationBuilder.AlterColumn<DateOnly>(
                name: "deleted_at",
                table: "Rooms",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "PointTransactions",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "deleted_at",
                table: "Payments",
                type: "date",
                nullable: true);

            migrationBuilder.AlterColumn<DateOnly>(
                name: "deleted_at",
                table: "Movies",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true);

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

            migrationBuilder.AlterColumn<DateOnly>(
                name: "deleted_at",
                table: "Locations",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true);

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

            migrationBuilder.AlterColumn<DateOnly>(
                name: "deleted_at",
                table: "Coupons",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateOnly>(
                name: "deleted_at",
                table: "ComboDetails",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateOnly>(
                name: "deleted_at",
                table: "Cinemas",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true);

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

            migrationBuilder.AlterColumn<DateOnly>(
                name: "deleted_at",
                table: "Actors",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true);
        }
    }
}
