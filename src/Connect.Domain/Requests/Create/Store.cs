namespace Connect.Requests.Create;

public interface IStore
{
    Task<bool> TokenExists(ClientToken token, CancellationToken cancellationToken);
    
    Task<bool> RequestExists(ClientToken token, CancellationToken cancellationToken);

    Task<long?> TryCreate(ApproveRequest request, ClientToken token, UserId userId, DateTime time,
        CancellationToken cancellationToken);
}