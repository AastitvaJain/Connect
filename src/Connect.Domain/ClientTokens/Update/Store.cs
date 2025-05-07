namespace Connect.ClientTokens.Update;

public interface IStore
{
    Task<Client?> Get(ClientToken clientToken, CancellationToken cancellationToken);
    
    Task<bool> TryUpdate(Client client, UserId userId, CancellationToken cancellationToken);
}