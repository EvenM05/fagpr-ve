using Microsoft.EntityFrameworkCore;

namespace Fagprove.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }
    }
}