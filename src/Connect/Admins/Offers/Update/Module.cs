namespace Connect.Admins.Offers.Update;

public static class Module
{
    public static void ConfigureUpdateOffers(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}