using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CinemaAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddProcessedByToBooking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "processed_by",
                table: "Bookings",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_processed_by",
                table: "Bookings",
                column: "processed_by");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Users_processed_by",
                table: "Bookings",
                column: "processed_by",
                principalTable: "Users",
                principalColumn: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Users_processed_by",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_processed_by",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "processed_by",
                table: "Bookings");
        }
    }
}
