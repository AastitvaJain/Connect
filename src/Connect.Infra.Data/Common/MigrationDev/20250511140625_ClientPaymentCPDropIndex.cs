using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Connect.Common.MigrationDev
{
    /// <inheritdoc />
    public partial class ClientPaymentCPDropIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
    }
}
