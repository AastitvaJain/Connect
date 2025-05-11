namespace Connect.Requests.Approve;

public interface IStore
{
    Task<bool> RequestExists(long requestId, CancellationToken cancellationToken);
    
    Task<bool> TryApprove(long requestId, ApproveRequest request, UserId userId, DateTime time, CancellationToken cancellationToken);
}