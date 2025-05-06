namespace Connect.Inventories.New.Get;

public static class Module
{
    public static void ConfigureGetNewInventories(this IServices services)
    {
        services
            .AddSingleton<IController, Controller>()
            .AddSingleton<IHandler, Handler>()
            .AddSingleton<IStore, Store>();
    }
}