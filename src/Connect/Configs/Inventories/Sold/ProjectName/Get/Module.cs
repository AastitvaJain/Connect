namespace Connect.Configs.Inventories.Sold.ProjectName.Get;

public static class Module
{
    public static void ConfigureSoldProjectNames(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}