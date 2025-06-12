using Fagprove.Models;
using Microsoft.EntityFrameworkCore;

namespace Fagprove.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }

        public DbSet<Project> Project { get; set; }

        public DbSet<User> User { get; set; }
        
        public DbSet<Resources> Resources { get; set; }
    }
}