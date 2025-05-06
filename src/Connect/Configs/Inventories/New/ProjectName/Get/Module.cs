namespace Connect.Configs.Inventories.New.ProjectName.Get;

public static class Module
{
    public static void ConfigureNewProjectNames(this IServices services)
    {
        services
            .AddSingleton<IController, Controller>()
            .AddSingleton<IHandler, Handler>()
            .AddSingleton<IStore, Store>();
    }
}