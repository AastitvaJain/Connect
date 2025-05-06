namespace Connect.Accounts.Logouts.Create;

public interface IEvent { }

public sealed record LoggedOut : IEvent;

public sealed record AlreadyLoggedOut : IEvent;