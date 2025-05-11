namespace Connect.Requests.Reject;

public interface IStore
{
    Task<bool> RequestExists(long requestId, CancellationToken cancellationToken);
    
    Task<bool> TryReject(long requestId, string reason, UserId userId, DateTime time, CancellationToken cancellationToken);
}