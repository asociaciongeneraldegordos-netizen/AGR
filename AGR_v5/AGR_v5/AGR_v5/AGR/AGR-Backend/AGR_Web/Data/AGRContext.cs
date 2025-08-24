using Microsoft.EntityFrameworkCore;
using AGR_Web.Models;

namespace AGR_Web.Data
{
    public class AGRContext : DbContext
    {
        public AGRContext(DbContextOptions<AGRContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Correo)
                .IsUnique();
        }
    }
}
