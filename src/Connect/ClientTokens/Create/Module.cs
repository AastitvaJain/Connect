namespace Connect.ClientTokens.Create;

public static class Module
{
    public static void ConfigureCreateClientToken(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}