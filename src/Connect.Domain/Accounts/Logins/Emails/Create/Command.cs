namespace Connect.Accounts.Logins.Emails.Create;

public sealed record Command(
    UserId UserId,
    PlainPassword Password);