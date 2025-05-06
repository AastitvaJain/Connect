namespace Connect.Accounts.Logouts.Create;

public static class Module
{
    public static void ConfigureCreateLogouts(this IServices services)
    {
        services
            .AddSingleton<IController, Controller>()
            .AddSingleton<IHandler, Handler>()
            .AddSingleton<IStore, Store>();
    }
}