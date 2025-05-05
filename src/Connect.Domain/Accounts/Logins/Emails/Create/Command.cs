namespace Connect.Accounts.Logins.Emails.Create;

public sealed record Command(
    EmailId EmailId,
    PlainPassword Password,
    DateTime CurrentTime);