namespace Connect.Configs.Inventories.Sold.ProjectName.Get;

public static class Module
{
    public static void ConfigureSoldProjectNames(this IServices services)
    {
        services
            .AddSingleton<IController, Controller>()
            .AddSingleton<IHandler, Handler>()
            .AddSingleton<IStore, Store>();
    }
}