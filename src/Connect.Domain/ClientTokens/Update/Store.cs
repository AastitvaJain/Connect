namespace Connect.ClientTokens.Update;

public interface IStore
{
    Task<Client?> Get(ClientToken clientToken, CancellationToken cancellationToken);
    
    Task<List<SoldInventory>?> GetSoldInventories(ClientToken clientToken, CancellationToken cancellationToken);
    
    Task<List<NewInventory>?> GetNewInventories(ClientToken clientToken, CancellationToken cancellationToken);
    
    Task<bool> TryUpdate(Client client, UserId userId, CancellationToken cancellationToken);
}