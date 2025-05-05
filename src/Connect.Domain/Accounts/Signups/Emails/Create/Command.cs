namespace Connect.Accounts.Signups.Emails.Create;

public sealed record Command(
    EmailId EmailId,
    PlainPassword Password,
    Name Name,
    DateTime CurrentTime);