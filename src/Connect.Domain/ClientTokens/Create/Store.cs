namespace Connect.ClientTokens.Create;

public interface IStore
{
    Task<bool> CheckSellRecords(List<PropertyRecord> sellRecords, CancellationToken cancellationToken);
    
    Task<ClientToken?> AlreadyCreated(List<PropertyRecord> sellRecords, CancellationToken cancellationToken);
    
    Task<ClientToken?> TryAdd(Client client, UserId userId, CancellationToken cancellationToken);
}