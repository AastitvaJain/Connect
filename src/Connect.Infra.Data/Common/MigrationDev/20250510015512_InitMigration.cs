using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Connect.Common.MigrationDev
{
    /// <inheritdoc />
    public partial class InitMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "account",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    group = table.Column<string>(type: "text", nullable: false),
                    state = table.Column<string>(type: "text", nullable: false),
                    email_id = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    password_salt = table.Column<byte[]>(type: "bytea", nullable: false),
                    password_hash = table.Column<byte[]>(type: "bytea", nullable: false),
                    password_iterations = table.Column<int>(type: "integer", nullable: false),
                    password_updated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    auth_token = table.Column<long>(type: "bigint", nullable: true),
                    auth_created = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_account", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "channel_partner",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_channel_partner", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "new_inventory",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    property_id = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    project_name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    project_type = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    unit_no = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    built_up_area = table.Column<float>(type: "real", nullable: false),
                    rate = table.Column<float>(type: "real", nullable: false),
                    total_consideration = table.Column<float>(type: "real", nullable: false),
                    booking_amount = table.Column<float>(type: "real", nullable: true),
                    revised_rate = table.Column<float>(type: "real", nullable: true),
                    revised_total_consideration = table.Column<float>(type: "real", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_new_inventory", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "project_offer",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    project_name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    offer_amount = table.Column<float>(type: "real", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_project_offer", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "sold_inventory",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    sr_no = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    booking_id = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    booking_date = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    property_id = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    project_name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    project_type = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    unit_no = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    unit_category = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    buyer_name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    built_up_area = table.Column<float>(type: "real", nullable: false),
                    rate = table.Column<float>(type: "real", nullable: false),
                    total_consideration = table.Column<float>(type: "real", nullable: false),
                    net_received = table.Column<float>(type: "real", nullable: false),
                    assured_price = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    revised_assured_price = table.Column<float>(type: "real", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sold_inventory", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "client",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false),
                    sequence = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:IdentitySequenceOptions", "'100000', '1', '', '999999', 'False', '1'")
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    email_id = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    phone_no = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    updated_by = table.Column<long>(type: "bigint", nullable: true),
                    UpdatedBy = table.Column<long>(type: "bigint", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_client", x => new { x.id, x.sequence });
                    table.ForeignKey(
                        name: "FK_client_account_UpdatedBy",
                        column: x => x.UpdatedBy,
                        principalTable: "account",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_client_account_updated_by",
                        column: x => x.updated_by,
                        principalTable: "account",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "client_payment",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    amount_paid = table.Column<float>(type: "real", nullable: false),
                    payment_mode = table.Column<string>(type: "text", nullable: false),
                    payment_id = table.Column<int>(type: "integer", nullable: false),
                    client_id = table.Column<int>(type: "integer", nullable: false),
                    client_sequence = table.Column<int>(type: "integer", nullable: false),
                    channel_partner_id = table.Column<Guid>(type: "uuid", nullable: true),
                    custom_channel_partner_name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    custom_channel_partner_number = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_client_payment", x => x.id);
                    table.ForeignKey(
                        name: "FK_client_payment_channel_partner_channel_partner_id",
                        column: x => x.channel_partner_id,
                        principalTable: "channel_partner",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_client_payment_client_client_id_client_sequence",
                        columns: x => new { x.client_id, x.client_sequence },
                        principalTable: "client",
                        principalColumns: new[] { "id", "sequence" },
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "property_record",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    property_record_id = table.Column<Guid>(type: "uuid", nullable: false),
                    original_rate = table.Column<float>(type: "real", nullable: false),
                    draft_rate = table.Column<float>(type: "real", nullable: true),
                    requested_rate = table.Column<float>(type: "real", nullable: true),
                    approved_rate = table.Column<float>(type: "real", nullable: true),
                    payment_plan = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    seller_id = table.Column<int>(type: "integer", nullable: true),
                    seller_sequence = table.Column<int>(type: "integer", nullable: true),
                    buyer_id = table.Column<int>(type: "integer", nullable: true),
                    buyer_sequence = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_property_record", x => x.id);
                    table.ForeignKey(
                        name: "FK_property_record_client_buyer_id_buyer_sequence",
                        columns: x => new { x.buyer_id, x.buyer_sequence },
                        principalTable: "client",
                        principalColumns: new[] { "id", "sequence" },
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_property_record_client_seller_id_seller_sequence",
                        columns: x => new { x.seller_id, x.seller_sequence },
                        principalTable: "client",
                        principalColumns: new[] { "id", "sequence" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_account_email_id",
                table: "account",
                column: "email_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_client_updated_by",
                table: "client",
                column: "updated_by");

            migrationBuilder.CreateIndex(
                name: "IX_client_UpdatedBy",
                table: "client",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_client_payment_channel_partner_id",
                table: "client_payment",
                column: "channel_partner_id");

            migrationBuilder.CreateIndex(
                name: "IX_client_payment_client_id_client_sequence",
                table: "client_payment",
                columns: new[] { "client_id", "client_sequence" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_property_record_buyer_id_buyer_sequence",
                table: "property_record",
                columns: new[] { "buyer_id", "buyer_sequence" });

            migrationBuilder.CreateIndex(
                name: "IX_property_record_seller_id_seller_sequence",
                table: "property_record",
                columns: new[] { "seller_id", "seller_sequence" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "client_payment");

            migrationBuilder.DropTable(
                name: "new_inventory");

            migrationBuilder.DropTable(
                name: "project_offer");

            migrationBuilder.DropTable(
                name: "property_record");

            migrationBuilder.DropTable(
                name: "sold_inventory");

            migrationBuilder.DropTable(
                name: "channel_partner");

            migrationBuilder.DropTable(
                name: "client");

            migrationBuilder.DropTable(
                name: "account");
        }
    }
}
