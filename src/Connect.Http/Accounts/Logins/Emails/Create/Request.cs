namespace Connect.Accounts.Logins.Emails.Create;

public sealed record Request(
    string? UserId,
    string? Password);