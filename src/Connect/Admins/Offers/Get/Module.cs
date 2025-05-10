namespace Connect.Admins.Offers.Get;

public static class Module
{
    public static void ConfigureGetOffers(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}