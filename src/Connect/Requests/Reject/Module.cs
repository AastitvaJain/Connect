namespace Connect.Requests.Reject;

public static class Module
{
    public static void ConfigureRejectRequests(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}