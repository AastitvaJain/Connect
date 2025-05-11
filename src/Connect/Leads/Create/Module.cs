namespace Connect.Leads.Create;

public static class Module
{
    public static void ConfigureCreateLeads(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}