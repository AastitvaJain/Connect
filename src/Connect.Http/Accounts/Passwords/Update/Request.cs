namespace Connect.Accounts.Passwords.Update;

public sealed record Request(
    string? OldPassword,
    string? NewPassword);