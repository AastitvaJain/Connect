namespace Connect.Accounts.Signups.Emails.Create;

public interface IHandler
{
    Task<IResult> Handle(Command command, CancellationToken cancellationToken);
}

internal sealed class Handler(IStore store, IAuthUserService authUserService) : IHandler
{
    public async Task<IResult> Handle(Command command, CancellationToken cancellationToken)
    {
        (EmailId emailId, PlainPassword password, Name name, DateTime currentTime) = command;

        if (await store.Count(emailId, cancellationToken) > 0)
        {
            return new EmailConflictResult();
        }
        
        UserId? userId = await store.CreateAccountId(cancellationToken);

        if (userId is null)
        {
            return new IdCreationErrorResult();
        }
        
        Account account = Account.Create((UserId)userId, emailId, name, password, currentTime);

        return await store.TryAdd(account, cancellationToken)
            ? new CreatedResult(authUserService.CreateAuthUserDto(account))
            : new EmailConflictResult();
    }
}