using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AGR_Web.Migrations
{
    /// <inheritdoc />
    public partial class CreateUsuarios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Miembros");

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Correo = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Peso = table.Column<int>(type: "int", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Correo",
                table: "Usuarios",
                column: "Correo",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.CreateTable(
                name: "Miembros",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Peso = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Miembros", x => x.Id);
                });
        }
    }
}
