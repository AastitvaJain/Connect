namespace Connect.Configs.ChannelPartners.Get;

public static class Module
{
    public static void ConfigureGetChannelPartners(this IServices services)
    {
        services
            .AddSingleton<IController, Controller>()
            .AddSingleton<IHandler, Handler>()
            .AddSingleton<IStore, Store>();
    }
}