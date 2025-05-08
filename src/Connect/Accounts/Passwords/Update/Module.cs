namespace Connect.Accounts.Passwords.Update;

public static class Module
{
    public static void ConfigureUpdatePasswords(this IServices services)
    {
        services
            .AddScoped<IController, Controller>()
            .AddScoped<IHandler, Handler>()
            .AddScoped<IStore, Store>();
    }
}