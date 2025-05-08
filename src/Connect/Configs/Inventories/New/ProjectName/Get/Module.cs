namespace Connect.Configs.Inventories.New.ProjectName.Get;

public static class Module
{
    public static void ConfigureNewProjectNames(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}