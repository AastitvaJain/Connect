using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Connect.Common.MigrationDev
{
    /// <inheritdoc />
    public partial class ApproveRequests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "approve_request",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:IdentitySequenceOptions", "'100000', '1', '', '999999', 'False', '1'")
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    client_id = table.Column<int>(type: "integer", nullable: false),
                    client_sequence = table.Column<int>(type: "integer", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_approve_request", x => x.Id);
                    table.ForeignKey(
                        name: "FK_approve_request_account_created_by",
                        column: x => x.created_by,
                        principalTable: "account",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_approve_request_account_updated_by",
                        column: x => x.updated_by,
                        principalTable: "account",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_approve_request_client_client_id_client_sequence",
                        columns: x => new { x.client_id, x.client_sequence },
                        principalTable: "client",
                        principalColumns: new[] { "id", "sequence" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_approve_request_client_id_client_sequence",
                table: "approve_request",
                columns: new[] { "client_id", "client_sequence" });

            migrationBuilder.CreateIndex(
                name: "IX_approve_request_created_by",
                table: "approve_request",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "IX_approve_request_updated_by",
                table: "approve_request",
                column: "updated_by");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "approve_request");
        }
    }
}
