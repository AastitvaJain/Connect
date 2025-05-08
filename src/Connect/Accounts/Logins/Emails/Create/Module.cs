namespace Connect.Accounts.Logins.Emails.Create;

public static class Module
{
    public static void ConfigureCreateEmailLogins(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}