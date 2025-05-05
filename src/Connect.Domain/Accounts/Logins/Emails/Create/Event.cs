namespace Connect.Accounts.Logins.Emails.Create;

public interface IEvent{}

public sealed record LoggedIn : IEvent;

public sealed record PasswordMismatch : IEvent;

public sealed record Locked : IEvent;