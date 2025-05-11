namespace Connect.Requests.Approve;

public interface IHandler
{
    Task<IResult> Handle(Command command, CancellationToken cancellationToken);    
}

internal sealed class Handler(IStore store) : IHandler
{
    public async Task<IResult> Handle(Command command, CancellationToken cancellationToken)
    {
        (UserId userId, long requestId, ApproveRequest request, DateTime currentTime) = command;
        
        if (!await store.RequestExists(requestId, cancellationToken))
        {
            return new NotFoundResult();
        }
        
        return await store.TryApprove(requestId, request, userId, currentTime, cancellationToken)
            ? new ApprovedResult()
            : new CouldNotApproveResult();       
    }
}