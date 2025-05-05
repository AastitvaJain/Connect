namespace Connect.Accounts.Auths.Create;

public interface IHandler
{
    Task<IResult> Handle(Command command, CancellationToken cancellationToken);
}

internal sealed class Handler(IStore store, IAuthService authService) : IHandler
{
    public async Task<IResult> Handle(Command command, CancellationToken cancellationToken)
    {
        (UserId userId, AuthToken token, DateTime currentTime) = command;
        
        Identity? identity = await store.GetIdentity(userId, cancellationToken);

        if (identity is null)
        {
            return new NotFoundResult();
        }
        
        IEvent @event = identity.Authorise(token, currentTime);

        switch (@event)
        {
            case Authorised:
                if (!await store.Update(identity, currentTime, cancellationToken))
                {
                    return new NotFoundResult();
                }
                
                AuthDto dto = authService.CreateAuthDto(
                    identity.Id, identity.Group, identity.State,
                    identity.Auth!);

                return new CreatedResult(dto);
            
            default:
                return @event switch
                {
                    TokenMismatch => new NotFoundResult(),
                    TokenExpired => new TokenExpiredResult(),
                    Locked => new LockedResult(),
                    _ => throw new NotImplementedException()
                };
        }
    }
}