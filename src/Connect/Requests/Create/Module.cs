namespace Connect.Requests.Create;

public static class Module
{
    public static void ConfigureCreateRequests(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}