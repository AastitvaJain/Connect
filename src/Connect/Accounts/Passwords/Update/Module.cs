namespace Connect.Accounts.Passwords.Update;

public static class Module
{
    public static void ConfigureUpdatePasswords(this IServices services)
    {
        services
            .AddSingleton<IController, Controller>()
            .AddSingleton<IHandler, Handler>()
            .AddSingleton<IStore, Store>();
    }
}