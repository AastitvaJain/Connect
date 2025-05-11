using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Connect.Common.MigrationDev
{
    /// <inheritdoc />
    public partial class UpdatedByFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_client_account_UpdatedBy",
                table: "client");

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

            migrationBuilder.RenameColumn(
                name: "UpdatedBy",
                table: "project_offer",
                newName: "created_by");

            migrationBuilder.RenameColumn(
                name: "UpdatedBy",
                table: "client",
                newName: "created_by");

            migrationBuilder.RenameIndex(
                name: "IX_client_UpdatedBy",
                table: "client",
                newName: "IX_client_created_by");

            migrationBuilder.CreateIndex(
                name: "IX_project_offer_updated_by",
                table: "project_offer",
                column: "updated_by");

            migrationBuilder.AddForeignKey(
                name: "FK_client_account_created_by",
                table: "client",
                column: "created_by",
                principalTable: "account",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_project_offer_account_updated_by",
                table: "project_offer",
                column: "updated_by",
                principalTable: "account",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_client_account_created_by",
                table: "client");

            migrationBuilder.DropForeignKey(
                name: "FK_project_offer_account_updated_by",
                table: "project_offer");

            migrationBuilder.DropIndex(
                name: "IX_project_offer_updated_by",
                table: "project_offer");

            migrationBuilder.RenameColumn(
                name: "created_by",
                table: "project_offer",
                newName: "UpdatedBy");

            migrationBuilder.RenameColumn(
                name: "created_by",
                table: "client",
                newName: "UpdatedBy");

            migrationBuilder.RenameIndex(
                name: "IX_client_created_by",
                table: "client",
                newName: "IX_client_UpdatedBy");

            migrationBuilder.AddColumn<long>(
                name: "CreatedByAccountId",
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
                name: "FK_client_account_UpdatedBy",
                table: "client",
                column: "UpdatedBy",
                principalTable: "account",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

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
    }
}
