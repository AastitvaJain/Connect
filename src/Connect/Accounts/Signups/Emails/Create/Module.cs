namespace Connect.Accounts.Signups.Emails.Create;

public static class Module
{
    public static void ConfigureCreateEmailSignup(this IServices services)
    {
        services
            .AddSingleton<IController, Controller>()
            .AddSingleton<IHandler, Handler>()
            .AddSingleton<IStore, Store>();
    }
}