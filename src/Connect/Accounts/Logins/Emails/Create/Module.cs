namespace Connect.Accounts.Logins.Emails.Create;

public static class Module
{
    public static void ConfigureCreateEmailLogins(this IServices services)
    {
        services
            .AddSingleton<IController, Controller>()
            .AddSingleton<IHandler, Handler>()
            .AddSingleton<IStore, Store>();
    }
}