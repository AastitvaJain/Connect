namespace Connect.Accounts.Auths.Create;

public interface IEvent {}

public sealed record Authorised : IEvent;

public sealed record TokenMismatch : IEvent;

public sealed record TokenExpired : IEvent;

public sealed record Locked : IEvent;