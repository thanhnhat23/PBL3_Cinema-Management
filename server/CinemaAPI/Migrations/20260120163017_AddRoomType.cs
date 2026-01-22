using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CinemaAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddRoomType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "columnNumber",
                table: "Seats",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "seatCode",
                table: "Seats",
                type: "varchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "col",
                table: "Rooms",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "row",
                table: "Rooms",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "image_overview",
                table: "Cinemas",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldMaxLength: 50)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "columnNumber",
                table: "Seats");

            migrationBuilder.DropColumn(
                name: "seatCode",
                table: "Seats");

            migrationBuilder.DropColumn(
                name: "col",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "row",
                table: "Rooms");

            migrationBuilder.AlterColumn<string>(
                name: "image_overview",
                table: "Cinemas",
                type: "varchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(100)",
                oldMaxLength: 100)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
