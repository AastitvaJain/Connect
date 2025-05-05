using Connect.Accounts.Auths.Create;
using Connect.Accounts.Logins.Emails.Create;
using Connect.Accounts.Signups.Emails.Create;

namespace Connect.Accounts;

public static class Module
{
    public static void MapAccountEndpoints(this IEndpoints endpoints)
    {
        endpoints.MapCreateEmailSignups();
        endpoints.MapCreateEmailLogins();
        endpoints.MapCreateAuth();
    }

    public static void ConfigureAccountModule(this IServices services)
    {
        services.AddSingleton<IAuthService, AuthService>();
        services.AddSingleton<IUserService, UserService>();
        services.AddSingleton<IAuthUserService, AuthUserService>();
        
        services.ConfigureCreateEmailSignup();
        services.ConfigureCreateEmailLogins();
        services.ConfigureCreateAuths();
    }
}