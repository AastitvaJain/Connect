namespace Connect;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

public class ConnectDbContextFactory : IDesignTimeDbContextFactory<ConnectDbContext>
{
    public ConnectDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ConnectDbContext>();

        // Use your actual connection string here
        var connectionString = "Host=localhost;Port=15432;Database=connectDev;Username=postgres;Password=rShEiRwsuG6UgyhRbjpl;SslMode=Require;";
        
        optionsBuilder.UseNpgsql(connectionString);

        return new ConnectDbContext(optionsBuilder.Options);
    }
}
