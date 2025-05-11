namespace Connect.Requests.Approve;

public static class Module
{
    public static void ConfigureApproveRequests(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}