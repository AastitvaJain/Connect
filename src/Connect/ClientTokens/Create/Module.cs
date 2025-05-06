namespace Connect.ClientTokens.Create;

public static class Module
{
    public static void ConfigureCreateClientToken(this IServices services)
    {
        services
            .AddSingleton<IController, Controller>()
            .AddSingleton<IHandler, Handler>()
            .AddSingleton<IStore, Store>();
    }
}