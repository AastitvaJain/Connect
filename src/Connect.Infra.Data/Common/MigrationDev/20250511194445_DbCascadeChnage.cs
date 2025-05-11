using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Connect.Common.MigrationDev
{
    /// <inheritdoc />
    public partial class DbCascadeChnage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_approval_cost_sheet_approve_request_approve_request_id",
                table: "approval_cost_sheet");

            migrationBuilder.DropForeignKey(
                name: "FK_approval_cost_sheet_item_approval_cost_sheet_cost_sheet_id",
                table: "approval_cost_sheet_item");

            migrationBuilder.DropForeignKey(
                name: "FK_approval_property_record_approve_request_buy_approve_reques~",
                table: "approval_property_record");

            migrationBuilder.DropForeignKey(
                name: "FK_approval_property_record_approve_request_sell_approve_reque~",
                table: "approval_property_record");

            migrationBuilder.DropForeignKey(
                name: "FK_approve_request_account_created_by",
                table: "approve_request");

            migrationBuilder.DropForeignKey(
                name: "FK_approve_request_account_updated_by",
                table: "approve_request");

            migrationBuilder.DropForeignKey(
                name: "FK_approve_request_client_client_id_client_sequence",
                table: "approve_request");

            migrationBuilder.DropForeignKey(
                name: "FK_client_account_created_by",
                table: "client");

            migrationBuilder.DropForeignKey(
                name: "FK_client_account_updated_by",
                table: "client");

            migrationBuilder.DropForeignKey(
                name: "FK_new_lead_account_created_by",
                table: "new_lead");

            migrationBuilder.DropForeignKey(
                name: "FK_new_lead_account_updated_by",
                table: "new_lead");

            migrationBuilder.DropForeignKey(
                name: "FK_project_offer_account_updated_by",
                table: "project_offer");

            migrationBuilder.DropForeignKey(
                name: "FK_property_record_client_buyer_id_buyer_sequence",
                table: "property_record");

            migrationBuilder.DropForeignKey(
                name: "FK_property_record_client_seller_id_seller_sequence",
                table: "property_record");

            migrationBuilder.DropForeignKey(
                name: "FK_property_record_new_lead_new_lead_id",
                table: "property_record");

            migrationBuilder.AddForeignKey(
                name: "FK_approval_cost_sheet_approve_request_approve_request_id",
                table: "approval_cost_sheet",
                column: "approve_request_id",
                principalTable: "approve_request",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_approval_cost_sheet_item_approval_cost_sheet_cost_sheet_id",
                table: "approval_cost_sheet_item",
                column: "cost_sheet_id",
                principalTable: "approval_cost_sheet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_approval_property_record_approve_request_buy_approve_reques~",
                table: "approval_property_record",
                column: "buy_approve_request_id",
                principalTable: "approve_request",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_approval_property_record_approve_request_sell_approve_reque~",
                table: "approval_property_record",
                column: "sell_approve_request_id",
                principalTable: "approve_request",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_approve_request_account_created_by",
                table: "approve_request",
                column: "created_by",
                principalTable: "account",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_approve_request_account_updated_by",
                table: "approve_request",
                column: "updated_by",
                principalTable: "account",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_approve_request_client_client_id_client_sequence",
                table: "approve_request",
                columns: new[] { "client_id", "client_sequence" },
                principalTable: "client",
                principalColumns: new[] { "id", "sequence" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_client_account_created_by",
                table: "client",
                column: "created_by",
                principalTable: "account",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_client_account_updated_by",
                table: "client",
                column: "updated_by",
                principalTable: "account",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_new_lead_account_created_by",
                table: "new_lead",
                column: "created_by",
                principalTable: "account",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_new_lead_account_updated_by",
                table: "new_lead",
                column: "updated_by",
                principalTable: "account",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_project_offer_account_updated_by",
                table: "project_offer",
                column: "updated_by",
                principalTable: "account",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_property_record_client_buyer_id_buyer_sequence",
                table: "property_record",
                columns: new[] { "buyer_id", "buyer_sequence" },
                principalTable: "client",
                principalColumns: new[] { "id", "sequence" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_property_record_client_seller_id_seller_sequence",
                table: "property_record",
                columns: new[] { "seller_id", "seller_sequence" },
                principalTable: "client",
                principalColumns: new[] { "id", "sequence" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_property_record_new_lead_new_lead_id",
                table: "property_record",
                column: "new_lead_id",
                principalTable: "new_lead",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_approval_cost_sheet_approve_request_approve_request_id",
                table: "approval_cost_sheet");

            migrationBuilder.DropForeignKey(
                name: "FK_approval_cost_sheet_item_approval_cost_sheet_cost_sheet_id",
                table: "approval_cost_sheet_item");

            migrationBuilder.DropForeignKey(
                name: "FK_approval_property_record_approve_request_buy_approve_reques~",
                table: "approval_property_record");

            migrationBuilder.DropForeignKey(
                name: "FK_approval_property_record_approve_request_sell_approve_reque~",
                table: "approval_property_record");

            migrationBuilder.DropForeignKey(
                name: "FK_approve_request_account_created_by",
                table: "approve_request");

            migrationBuilder.DropForeignKey(
                name: "FK_approve_request_account_updated_by",
                table: "approve_request");

            migrationBuilder.DropForeignKey(
                name: "FK_approve_request_client_client_id_client_sequence",
                table: "approve_request");

            migrationBuilder.DropForeignKey(
                name: "FK_client_account_created_by",
                table: "client");

            migrationBuilder.DropForeignKey(
                name: "FK_client_account_updated_by",
                table: "client");

            migrationBuilder.DropForeignKey(
                name: "FK_new_lead_account_created_by",
                table: "new_lead");

            migrationBuilder.DropForeignKey(
                name: "FK_new_lead_account_updated_by",
                table: "new_lead");

            migrationBuilder.DropForeignKey(
                name: "FK_project_offer_account_updated_by",
                table: "project_offer");

            migrationBuilder.DropForeignKey(
                name: "FK_property_record_client_buyer_id_buyer_sequence",
                table: "property_record");

            migrationBuilder.DropForeignKey(
                name: "FK_property_record_client_seller_id_seller_sequence",
                table: "property_record");

            migrationBuilder.DropForeignKey(
                name: "FK_property_record_new_lead_new_lead_id",
                table: "property_record");

            migrationBuilder.AddForeignKey(
                name: "FK_approval_cost_sheet_approve_request_approve_request_id",
                table: "approval_cost_sheet",
                column: "approve_request_id",
                principalTable: "approve_request",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_approval_cost_sheet_item_approval_cost_sheet_cost_sheet_id",
                table: "approval_cost_sheet_item",
                column: "cost_sheet_id",
                principalTable: "approval_cost_sheet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_approval_property_record_approve_request_buy_approve_reques~",
                table: "approval_property_record",
                column: "buy_approve_request_id",
                principalTable: "approve_request",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_approval_property_record_approve_request_sell_approve_reque~",
                table: "approval_property_record",
                column: "sell_approve_request_id",
                principalTable: "approve_request",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_approve_request_account_created_by",
                table: "approve_request",
                column: "created_by",
                principalTable: "account",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_approve_request_account_updated_by",
                table: "approve_request",
                column: "updated_by",
                principalTable: "account",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_approve_request_client_client_id_client_sequence",
                table: "approve_request",
                columns: new[] { "client_id", "client_sequence" },
                principalTable: "client",
                principalColumns: new[] { "id", "sequence" },
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_client_account_created_by",
                table: "client",
                column: "created_by",
                principalTable: "account",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_client_account_updated_by",
                table: "client",
                column: "updated_by",
                principalTable: "account",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_new_lead_account_created_by",
                table: "new_lead",
                column: "created_by",
                principalTable: "account",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_new_lead_account_updated_by",
                table: "new_lead",
                column: "updated_by",
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

            migrationBuilder.AddForeignKey(
                name: "FK_property_record_client_buyer_id_buyer_sequence",
                table: "property_record",
                columns: new[] { "buyer_id", "buyer_sequence" },
                principalTable: "client",
                principalColumns: new[] { "id", "sequence" },
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_property_record_client_seller_id_seller_sequence",
                table: "property_record",
                columns: new[] { "seller_id", "seller_sequence" },
                principalTable: "client",
                principalColumns: new[] { "id", "sequence" },
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_property_record_new_lead_new_lead_id",
                table: "property_record",
                column: "new_lead_id",
                principalTable: "new_lead",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
