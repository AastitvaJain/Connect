namespace Connect;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

public class ConnectDbContextFactory : IDesignTimeDbContextFactory<ConnectDbContext>
{
    public ConnectDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ConnectDbContext>();

        // Use your actual connection string here
        var connectionString = "Host=localhost;Port=5432;Database=connectTest;Username=postgres;Password=password;SslMode=Prefer;";
        
        optionsBuilder.UseNpgsql(connectionString);

        return new ConnectDbContext(optionsBuilder.Options);
    }
}
