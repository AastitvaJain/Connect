namespace Connect.ClientTokens.Get;

public static class Module
{
    public static void ConfigureGetClientToken(this IServices services)
    {
        services
            .AddSingleton<IController, Controller>()
            .AddSingleton<IHandler, Handler>()
            .AddSingleton<IStore, Store>();
    }
}