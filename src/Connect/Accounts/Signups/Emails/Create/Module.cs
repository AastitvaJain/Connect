namespace Connect.Accounts.Signups.Emails.Create;

public static class Module
{
    public static void ConfigureCreateEmailSignup(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}