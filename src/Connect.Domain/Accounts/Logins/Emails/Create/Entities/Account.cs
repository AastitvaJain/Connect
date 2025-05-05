namespace Connect.Accounts.Logins.Emails.Create;

public sealed record Account(
    long Id,
    UserId UserId,
    Group Group,
    State State,
    string Name,
    Auth Auth) : IAuthUser;