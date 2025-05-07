namespace Connect.ClientTokens.Update;

public static class Module
{
    public static void ConfigureUpdateClientToken(this IServices services)
    {
        services
            .AddSingleton<IController, Controller>()
            .AddSingleton<IHandler, Handler>()
            .AddSingleton<IStore, Store>();
    }
}