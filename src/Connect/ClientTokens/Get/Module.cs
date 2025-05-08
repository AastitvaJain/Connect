namespace Connect.ClientTokens.Get;

public static class Module
{
    public static void ConfigureGetClientToken(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}