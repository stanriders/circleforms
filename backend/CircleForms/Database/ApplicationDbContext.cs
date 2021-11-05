using CircleForms.Models.OAuth;
using Microsoft.EntityFrameworkCore;

namespace CircleForms.Database
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options)
            : base(options)
        {
#if !DEBUG
            Database.Migrate();
#endif
        }

        public DbSet<OAuthToken> Tokens { get; set; }
    }
}
