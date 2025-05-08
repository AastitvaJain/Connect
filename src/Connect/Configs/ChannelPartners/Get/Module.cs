namespace Connect.Configs.ChannelPartners.Get;

public static class Module
{
    public static void ConfigureGetChannelPartners(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}