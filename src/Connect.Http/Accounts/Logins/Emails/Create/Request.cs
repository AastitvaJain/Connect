namespace Connect.Accounts.Logins.Emails.Create;

public sealed record Request(
    string? EmailId,
    string? Password);