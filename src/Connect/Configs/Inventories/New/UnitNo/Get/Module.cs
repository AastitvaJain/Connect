namespace Connect.Configs.Inventories.New.UnitNo.Get;

public static class Module
{
    public static void ConfigureNewUnitNos(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}