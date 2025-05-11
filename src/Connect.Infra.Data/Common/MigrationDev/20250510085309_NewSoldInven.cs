using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Connect.Common.MigrationDev
{
    /// <inheritdoc />
    public partial class NewSoldInven : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "revised_rate",
                table: "new_inventory");

            migrationBuilder.RenameColumn(
                name: "revised_assured_price",
                table: "sold_inventory",
                newName: "discount");

            migrationBuilder.RenameColumn(
                name: "revised_total_consideration",
                table: "new_inventory",
                newName: "premium");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "discount",
                table: "sold_inventory",
                newName: "revised_assured_price");

            migrationBuilder.RenameColumn(
                name: "premium",
                table: "new_inventory",
                newName: "revised_total_consideration");

            migrationBuilder.AddColumn<float>(
                name: "revised_rate",
                table: "new_inventory",
                type: "real",
                nullable: true);
        }
    }
}
