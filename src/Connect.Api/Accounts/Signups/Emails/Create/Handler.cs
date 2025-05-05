namespace Connect.Accounts.Signups.Emails.Create;

public interface IHandler
{
    Task<IResult> Handle(Command command, CancellationToken cancellationToken);
}

internal sealed class Handler : IHandler
{
    public Task<IResult> Handle(Command command, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}