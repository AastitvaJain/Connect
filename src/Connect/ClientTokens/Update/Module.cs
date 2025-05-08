namespace Connect.ClientTokens.Update;

public static class Module
{
    public static void ConfigureUpdateClientToken(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}