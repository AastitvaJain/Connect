namespace Connect.Inventories.Sold.Get;

public static class Module
{
    public static void ConfigureGetSoldInventories(this IServices services)
    {
        services
            .AddSingleton<IController, Controller>()
            .AddSingleton<IHandler, Handler>()
            .AddSingleton<IStore, Store>();
    }
}