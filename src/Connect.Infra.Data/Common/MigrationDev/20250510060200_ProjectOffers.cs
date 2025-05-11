using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Connect.Common.MigrationDev
{
    /// <inheritdoc />
    public partial class ProjectOffers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "CreatedByAccountId",
                table: "project_offer",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "UpdatedBy",
                table: "project_offer",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "project_offer",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "project_offer",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<long>(
                name: "updated_by",
                table: "project_offer",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_project_offer_CreatedByAccountId",
                table: "project_offer",
                column: "CreatedByAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_project_offer_UpdatedBy",
                table: "project_offer",
                column: "UpdatedBy");

            migrationBuilder.AddForeignKey(
                name: "FK_project_offer_account_CreatedByAccountId",
                table: "project_offer",
                column: "CreatedByAccountId",
                principalTable: "account",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_project_offer_account_UpdatedBy",
                table: "project_offer",
                column: "UpdatedBy",
                principalTable: "account",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_project_offer_account_CreatedByAccountId",
                table: "project_offer");

            migrationBuilder.DropForeignKey(
                name: "FK_project_offer_account_UpdatedBy",
                table: "project_offer");

            migrationBuilder.DropIndex(
                name: "IX_project_offer_CreatedByAccountId",
                table: "project_offer");

            migrationBuilder.DropIndex(
                name: "IX_project_offer_UpdatedBy",
                table: "project_offer");

            migrationBuilder.DropColumn(
                name: "CreatedByAccountId",
                table: "project_offer");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "project_offer");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "project_offer");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "project_offer");

            migrationBuilder.DropColumn(
                name: "updated_by",
                table: "project_offer");
        }
    }
}
