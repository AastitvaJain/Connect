namespace Connect.Accounts.Passwords.Update;

public interface IEvent { }

public sealed record PasswordUpdated : IEvent;

public sealed record PasswordMismatch : IEvent;

public sealed record Locked : IEvent;