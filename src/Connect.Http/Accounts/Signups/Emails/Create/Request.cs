namespace Connect.Accounts.Signups.Emails.Create;

public sealed record Request(
    string? Email,
    string? Password,
    string? Name);