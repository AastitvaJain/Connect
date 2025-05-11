namespace Connect.Requests.Reject;

public interface IHandler
{
    Task<IResult> Handle(Command command, CancellationToken cancellationToken);    
}

internal sealed class Handler(IStore store) : IHandler
{
    public async Task<IResult> Handle(Command command, CancellationToken cancellationToken)
    {
        (UserId userId, long requestId, string reason, DateTime currentTime) = command;

        if (!await store.RequestExists(requestId, cancellationToken))
        {
            return new NotFoundResult();
        }
        
        return await store.TryReject(requestId, reason, userId, currentTime, cancellationToken)
            ? new RejectedResult()
            : new CouldNotRejectResult();       
    }
}