namespace Connect;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

public class ConnectDbContextFactory : IDesignTimeDbContextFactory<ConnectDbContext>
{
    public ConnectDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ConnectDbContext>();

        // Use your actual connection string here
        var connectionString = "Host=connect-db.c3qc60mess1q.ap-south-1.rds.amazonaws.com;Port=5432;Database=connectDevTest;Username=connect_admin;Password=B4WbPRhZwcIFE8o9FdAd;SslMode=Require;";
        
        optionsBuilder.UseNpgsql(connectionString);

        return new ConnectDbContext(optionsBuilder.Options);
    }
}
