namespace Connect.Inventories.New.Get;

public static class Module
{
    public static void ConfigureGetNewInventories(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}