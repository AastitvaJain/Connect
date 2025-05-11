namespace Connect.Requests.Get.ByToken;

public static class Module
{
    public static void ConfigureGetRequestsByToken(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}