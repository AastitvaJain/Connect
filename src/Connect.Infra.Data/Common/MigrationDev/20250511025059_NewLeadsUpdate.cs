using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Connect.Common.MigrationDev
{
    /// <inheritdoc />
    public partial class NewLeadsUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_property_record_new_lead_NewLeadId",
                table: "property_record");

            migrationBuilder.RenameColumn(
                name: "NewLeadId",
                table: "property_record",
                newName: "new_lead_id");

            migrationBuilder.RenameIndex(
                name: "IX_property_record_NewLeadId",
                table: "property_record",
                newName: "IX_property_record_new_lead_id");

            migrationBuilder.AddForeignKey(
                name: "FK_property_record_new_lead_new_lead_id",
                table: "property_record",
                column: "new_lead_id",
                principalTable: "new_lead",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_property_record_new_lead_new_lead_id",
                table: "property_record");

            migrationBuilder.RenameColumn(
                name: "new_lead_id",
                table: "property_record",
                newName: "NewLeadId");

            migrationBuilder.RenameIndex(
                name: "IX_property_record_new_lead_id",
                table: "property_record",
                newName: "IX_property_record_NewLeadId");

            migrationBuilder.AddForeignKey(
                name: "FK_property_record_new_lead_NewLeadId",
                table: "property_record",
                column: "NewLeadId",
                principalTable: "new_lead",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
