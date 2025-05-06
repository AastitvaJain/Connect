namespace Connect.Accounts.Passwords.Update;

public sealed record Command(
    UserId UserId,
    PlainPassword OldPassword,
    PlainPassword NewPassword,
    DateTime CurrentTime);