namespace Connect.Accounts.Logouts.Create;

public static class Module
{
    public static void ConfigureCreateLogouts(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}