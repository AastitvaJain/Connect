namespace Connect.ClientTokens.Get;

public interface IStore
{
    Task<Client?> Get(ClientToken clientToken, CancellationToken cancellationToken);
}