using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Connect.Common.MigrationDev
{
    /// <inheritdoc />
    public partial class TokenSubmit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_submitted",
                table: "client",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_submitted",
                table: "client");
        }
    }
}
