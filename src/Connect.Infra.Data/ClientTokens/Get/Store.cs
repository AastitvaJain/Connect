namespace Connect.ClientTokens.Get;

internal sealed class Store(IDbService dbService) : ClientTokenStore(dbService), IStore
{
}