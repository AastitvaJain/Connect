namespace Connect.ClientTokens.Get;

internal sealed class Store(ConnectDbContext context) : ClientTokenStore(context), IStore
{
}