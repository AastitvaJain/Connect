namespace Connect.Requests.Get.ByStatus;

public static class Module
{
    public static void ConfigureGetRequestsByStatus(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}