namespace Connect.Inventories.Sold.Get;

public static class Module
{
    public static void ConfigureGetSoldInventories(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}