using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CinemaAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCinema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "latitude",
                table: "Cinemas",
                type: "decimal(18,10)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(200)",
                oldMaxLength: 200)
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<decimal>(
                name: "longitude",
                table: "Cinemas",
                type: "decimal(18,10)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "longitude",
                table: "Cinemas");

            migrationBuilder.AlterColumn<string>(
                name: "latitude",
                table: "Cinemas",
                type: "varchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,10)")
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
