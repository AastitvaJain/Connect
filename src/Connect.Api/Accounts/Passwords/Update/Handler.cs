namespace Connect.Accounts.Passwords.Update;

public interface IHandler
{
    Task<IResult> Handle(Command command, CancellationToken cancellationToken);
}

public class Handler(IStore store) : IHandler
{
    public async Task<IResult> Handle(Command command, CancellationToken cancellationToken)
    {
        (UserId userId, PlainPassword oldPassword, PlainPassword newPassword, DateTime currentTime) = command;
        
        Identity? identity = await store.GetIdentity(userId, cancellationToken);

        if (identity is null)
        {
            return new NotFoundResult();
        }

        IEvent @event = identity.UpdatePassword(oldPassword, newPassword, currentTime);

        return @event switch
        {
            PasswordUpdated => await store.Update(identity, cancellationToken)
                ? new UpdatedResult()
                : new NotFoundResult(),
            _ => @event switch
            {
                PasswordMismatch => new PasswordMismatchResult(),
                Locked => new LockedResult(),
                _ => throw new NotImplementedException()
            }
        };
    }
}