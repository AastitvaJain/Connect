namespace Connect.Configs.Inventories.Sold.UnitNo.Get;

public static class Module
{
    public static void ConfigureSoldUnitNos(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}