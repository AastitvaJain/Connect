using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Connect.Common.MigrationDev
{
    /// <inheritdoc />
    public partial class ClientPaymentCP : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_client_payment_channel_partner_channel_partner_id",
                table: "client_payment");

            migrationBuilder.DropIndex(
                name: "IX_client_payment_channel_partner_id",
                table: "client_payment");

            migrationBuilder.AlterColumn<string>(
                name: "channel_partner_id",
                table: "client_payment",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ChannelPartnerId1",
                table: "client_payment",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_client_payment_ChannelPartnerId1",
                table: "client_payment",
                column: "ChannelPartnerId1");

            migrationBuilder.AddForeignKey(
                name: "FK_client_payment_channel_partner_ChannelPartnerId1",
                table: "client_payment",
                column: "ChannelPartnerId1",
                principalTable: "channel_partner",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_client_payment_channel_partner_ChannelPartnerId1",
                table: "client_payment");

            migrationBuilder.DropIndex(
                name: "IX_client_payment_ChannelPartnerId1",
                table: "client_payment");

            migrationBuilder.DropColumn(
                name: "ChannelPartnerId1",
                table: "client_payment");

            migrationBuilder.AlterColumn<Guid>(
                name: "channel_partner_id",
                table: "client_payment",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_client_payment_channel_partner_id",
                table: "client_payment",
                column: "channel_partner_id");

            migrationBuilder.AddForeignKey(
                name: "FK_client_payment_channel_partner_channel_partner_id",
                table: "client_payment",
                column: "channel_partner_id",
                principalTable: "channel_partner",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
