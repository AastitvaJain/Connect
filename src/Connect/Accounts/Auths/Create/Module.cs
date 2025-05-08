namespace Connect.Accounts.Auths.Create;

public static class Module
{
    public static void ConfigureCreateAuths(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}