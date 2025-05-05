namespace Connect.Accounts.Auths.Create;

public sealed record Command(
    UserId UserId,
    AuthToken AuthToken,
    DateTime CurrentTime);