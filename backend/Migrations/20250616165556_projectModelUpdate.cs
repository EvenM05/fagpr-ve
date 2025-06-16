using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class projectModelUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CustomerId",
                table: "Project",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Project_CustomerId",
                table: "Project",
                column: "CustomerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Project_Customers_CustomerId",
                table: "Project",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Project_Customers_CustomerId",
                table: "Project");

            migrationBuilder.DropIndex(
                name: "IX_Project_CustomerId",
                table: "Project");

            migrationBuilder.DropColumn(
                name: "CustomerId",
                table: "Project");
        }
    }
}
