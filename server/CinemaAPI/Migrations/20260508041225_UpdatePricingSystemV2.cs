using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CinemaAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePricingSystemV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShowTimePrices_ShowTimes_showtime_id",
                table: "ShowTimePrices");

            migrationBuilder.DropColumn(
                name: "price_override",
                table: "ShowTimeSeats");

            migrationBuilder.RenameColumn(
                name: "showtime_id",
                table: "ShowTimePrices",
                newName: "slot_id");

            migrationBuilder.RenameIndex(
                name: "IX_ShowTimePrices_showtime_id",
                table: "ShowTimePrices",
                newName: "IX_ShowTimePrices_slot_id");

            migrationBuilder.AlterColumn<decimal>(
                name: "base_price",
                table: "ShowTimePrices",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(65,30)");

            migrationBuilder.AddColumn<decimal>(
                name: "price",
                table: "SeatTypes",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddForeignKey(
                name: "FK_ShowTimePrices_ShowTimeSlots_slot_id",
                table: "ShowTimePrices",
                column: "slot_id",
                principalTable: "ShowTimeSlots",
                principalColumn: "slot_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShowTimePrices_ShowTimeSlots_slot_id",
                table: "ShowTimePrices");

            migrationBuilder.DropColumn(
                name: "price",
                table: "SeatTypes");

            migrationBuilder.RenameColumn(
                name: "slot_id",
                table: "ShowTimePrices",
                newName: "showtime_id");

            migrationBuilder.RenameIndex(
                name: "IX_ShowTimePrices_slot_id",
                table: "ShowTimePrices",
                newName: "IX_ShowTimePrices_showtime_id");

            migrationBuilder.AddColumn<decimal>(
                name: "price_override",
                table: "ShowTimeSeats",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "base_price",
                table: "ShowTimePrices",
                type: "decimal(65,30)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AddForeignKey(
                name: "FK_ShowTimePrices_ShowTimes_showtime_id",
                table: "ShowTimePrices",
                column: "showtime_id",
                principalTable: "ShowTimes",
                principalColumn: "showtime_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
