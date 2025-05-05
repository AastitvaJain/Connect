namespace Connect.Accounts.Auths.Create;

public static class Module
{
    public static void ConfigureCreateAuths(this IServices services)
    {
        services
            .AddSingleton<IController, Controller>()
            .AddSingleton<IHandler, Handler>()
            .AddSingleton<IStore, Store>();
    }
}