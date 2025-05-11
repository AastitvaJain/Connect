using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Connect.Common.MigrationDev
{
    /// <inheritdoc />
    public partial class NewLeads : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "NewLeadId",
                table: "property_record",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "new_lead",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    lead_status = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    interested_project = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    created_by = table.Column<long>(type: "bigint", nullable: true),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_new_lead", x => x.id);
                    table.ForeignKey(
                        name: "FK_new_lead_account_created_by",
                        column: x => x.created_by,
                        principalTable: "account",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_new_lead_account_updated_by",
                        column: x => x.updated_by,
                        principalTable: "account",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_property_record_NewLeadId",
                table: "property_record",
                column: "NewLeadId");

            migrationBuilder.CreateIndex(
                name: "IX_new_lead_created_by",
                table: "new_lead",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "IX_new_lead_updated_by",
                table: "new_lead",
                column: "updated_by");

            migrationBuilder.AddForeignKey(
                name: "FK_property_record_new_lead_NewLeadId",
                table: "property_record",
                column: "NewLeadId",
                principalTable: "new_lead",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_property_record_new_lead_NewLeadId",
                table: "property_record");

            migrationBuilder.DropTable(
                name: "new_lead");

            migrationBuilder.DropIndex(
                name: "IX_property_record_NewLeadId",
                table: "property_record");

            migrationBuilder.DropColumn(
                name: "NewLeadId",
                table: "property_record");
        }
    }
}
