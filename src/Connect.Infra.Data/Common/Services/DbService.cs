namespace Connect;

public interface IDbService
{
    public ConnectDbContext DbContext { get; }
}

internal sealed class DbService : IDbService
{
    public ConnectDbContext DbContext { get; }

    public DbService(DbConfig config)
    {
        var connectionString = $"server={config.Server};" +
                               $"port={config.Port};" +
                               $"database={config.Database};" +
                               $"user={config.User};" +
                               $"password={config.Password};" +
                               $"SslMode=Preferred;";
        
        var options = new DbContextOptionsBuilder<ConnectDbContext>();
        
        options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));

        DbContext = new ConnectDbContext(
            options.Options
        );
        
        // Todo: Remove this
        //DbContext.Database.EnsureCreated();
    }
}