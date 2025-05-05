namespace Connect;

public class ConnectDbContext(DbContextOptions<ConnectDbContext> options) : DbContext(options)
{
    public DbSet<AccountDao> Accounts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AccountDao>().ToTable("Accounts");
    }
}