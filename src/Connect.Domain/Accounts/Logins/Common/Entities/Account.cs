namespace Connect.Accounts.Logins;

public sealed record Account(
    long Id,
    string EmailId,
    Group Group,
    State State,
    string Name,
    Auth Auth
    ) : IAuthUser
{
    
}