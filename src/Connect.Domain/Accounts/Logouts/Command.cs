namespace Connect.Accounts.Logouts;

public sealed record Command(
    UserId UserId,
    DateTime CurrentTime);