using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Connect.Common.MigrationDev
{
    /// <inheritdoc />
    public partial class ApprovalInit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "Id",
                table: "approve_request",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:IdentitySequenceOptions", "'100000', '1', '', '', 'False', '1'")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn)
                .OldAnnotation("Npgsql:IdentitySequenceOptions", "'100000', '1', '', '999999', 'False', '1'")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn);

            migrationBuilder.AddColumn<bool>(
                name: "is_applied",
                table: "approve_request",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "approval_cost_sheet",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:IdentitySequenceOptions", "'100000', '1', '', '', 'False', '1'")
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    property_record_id = table.Column<Guid>(type: "uuid", nullable: false),
                    approve_request_id = table.Column<long>(type: "bigint", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_approval_cost_sheet", x => x.Id);
                    table.ForeignKey(
                        name: "FK_approval_cost_sheet_approve_request_approve_request_id",
                        column: x => x.approve_request_id,
                        principalTable: "approve_request",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "approval_property_record",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:IdentitySequenceOptions", "'100000', '1', '', '', 'False', '1'")
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    property_record_id = table.Column<Guid>(type: "uuid", nullable: false),
                    original_rate = table.Column<float>(type: "real", nullable: false),
                    proposed_rate = table.Column<float>(type: "real", nullable: true),
                    sell_approve_request_id = table.Column<long>(type: "bigint", nullable: true),
                    buy_approve_request_id = table.Column<long>(type: "bigint", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_approval_property_record", x => x.Id);
                    table.ForeignKey(
                        name: "FK_approval_property_record_approve_request_buy_approve_reques~",
                        column: x => x.buy_approve_request_id,
                        principalTable: "approve_request",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_approval_property_record_approve_request_sell_approve_reque~",
                        column: x => x.sell_approve_request_id,
                        principalTable: "approve_request",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "approval_cost_sheet_item",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:IdentitySequenceOptions", "'100000', '1', '', '', 'False', '1'")
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    cost_sheet_id = table.Column<long>(type: "bigint", nullable: false),
                    particular = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    payment_percentage = table.Column<float>(type: "real", nullable: true),
                    total_payment_without_tax = table.Column<float>(type: "real", nullable: true),
                    ft_adjustment = table.Column<float>(type: "real", nullable: true),
                    discount_adjustment = table.Column<float>(type: "real", nullable: true),
                    net_payable_by_customer = table.Column<float>(type: "real", nullable: true),
                    gst_payable = table.Column<float>(type: "real", nullable: true),
                    sequence = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_approval_cost_sheet_item", x => x.Id);
                    table.ForeignKey(
                        name: "FK_approval_cost_sheet_item_approval_cost_sheet_cost_sheet_id",
                        column: x => x.cost_sheet_id,
                        principalTable: "approval_cost_sheet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_approval_cost_sheet_approve_request_id",
                table: "approval_cost_sheet",
                column: "approve_request_id");

            migrationBuilder.CreateIndex(
                name: "IX_approval_cost_sheet_item_cost_sheet_id",
                table: "approval_cost_sheet_item",
                column: "cost_sheet_id");

            migrationBuilder.CreateIndex(
                name: "IX_approval_property_record_buy_approve_request_id",
                table: "approval_property_record",
                column: "buy_approve_request_id");

            migrationBuilder.CreateIndex(
                name: "IX_approval_property_record_sell_approve_request_id",
                table: "approval_property_record",
                column: "sell_approve_request_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "approval_cost_sheet_item");

            migrationBuilder.DropTable(
                name: "approval_property_record");

            migrationBuilder.DropTable(
                name: "approval_cost_sheet");

            migrationBuilder.DropColumn(
                name: "is_applied",
                table: "approve_request");

            migrationBuilder.AlterColumn<long>(
                name: "Id",
                table: "approve_request",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:IdentitySequenceOptions", "'100000', '1', '', '999999', 'False', '1'")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn)
                .OldAnnotation("Npgsql:IdentitySequenceOptions", "'100000', '1', '', '', 'False', '1'")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn);
        }
    }
}
