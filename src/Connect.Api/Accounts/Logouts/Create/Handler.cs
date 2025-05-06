namespace Connect.Accounts.Logouts.Create;

public interface IHandler
{
    Task<IResult> Handle(Command command, CancellationToken cancellationToken);
}

internal sealed class Handler(IStore store) : IHandler
{
    public async Task<IResult> Handle(Command command, CancellationToken cancellationToken)
    {
        (UserId userId, DateTime currentTime) = command;
        
        Identity? identity = await store.GetIdentity(userId, cancellationToken);

        if (identity is null)
        {
            return new NotFoundResult();
        }
        
        IEvent @event = identity.Logout(currentTime);

        return @event switch
        {
            LoggedOut => (await store.Update(identity, cancellationToken)
                ? new LoggedOutResult()
                : new NotFoundResult()),
            _ => @event switch
            {
                AlreadyLoggedOut => new AlreadyLoggedOutResult(),
                _ => throw new NotImplementedException()
            }
        };
    }
}