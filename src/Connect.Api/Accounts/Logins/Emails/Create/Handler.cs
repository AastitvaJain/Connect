namespace Connect.Accounts.Logins.Emails.Create;

public interface IHandler
{
    Task<IResult> Handle(Command command, CancellationToken cancellationToken);
}

internal sealed class Handler(IStore store, IAuthUserService authUserService) : IHandler
{
    public async Task<IResult> Handle(Command command, CancellationToken cancellationToken)
    {
        (EmailId emailId, PlainPassword password, DateTime currentTime) = command;
        
        Identity? identity = await store.GetIdentity(emailId, cancellationToken);

        if (identity is null)
        {
            return new NotFoundResult();
        }
        
        IEvent @event = identity.Login(password, currentTime);

        switch (@event)
        {
            case LoggedIn:
                Account? account = await store.GetUpdatedAccount(identity, currentTime, cancellationToken);
                
                return account is not null
                    ? new CreatedResult(authUserService.CreateAuthUserDto(account))
                    : new NotFoundResult();
            
            default:
                return @event switch
                {
                    PasswordMismatch => new PasswordMismatchResult(),
                    Locked => new LockedResult(),
                    _ => throw new NotImplementedException()
                };
        }
    }
}