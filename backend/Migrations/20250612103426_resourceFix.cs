using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class resourceFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Resources_Project_ComplaintId",
                table: "Resources");

            migrationBuilder.DropIndex(
                name: "IX_Resources_ComplaintId",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "ComplaintId",
                table: "Resources");

            migrationBuilder.CreateIndex(
                name: "IX_Resources_ProjectId",
                table: "Resources",
                column: "ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_Resources_Project_ProjectId",
                table: "Resources",
                column: "ProjectId",
                principalTable: "Project",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Resources_Project_ProjectId",
                table: "Resources");

            migrationBuilder.DropIndex(
                name: "IX_Resources_ProjectId",
                table: "Resources");

            migrationBuilder.AddColumn<Guid>(
                name: "ComplaintId",
                table: "Resources",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Resources_ComplaintId",
                table: "Resources",
                column: "ComplaintId");

            migrationBuilder.AddForeignKey(
                name: "FK_Resources_Project_ComplaintId",
                table: "Resources",
                column: "ComplaintId",
                principalTable: "Project",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
