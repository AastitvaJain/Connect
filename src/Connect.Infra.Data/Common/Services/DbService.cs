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
        var connectionString = $"Host={config.Server};" +
                               $"Port={config.Port};" +
                               $"Database={config.Database};" +
                               $"Username={config.User};" +
                               $"Password={config.Password};" +
                               $"SslMode=Prefer;";


        var options = new DbContextOptionsBuilder<ConnectDbContext>();
        
        options.UseNpgsql(connectionString);

        DbContext = new ConnectDbContext(
            options.Options
        );
        
        // todo : Remove this before production
        DbContext.Database.EnsureCreated();
    }
}