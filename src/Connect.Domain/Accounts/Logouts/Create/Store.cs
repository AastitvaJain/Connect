namespace Connect.Accounts.Logouts.Create;

public interface IStore
{
    Task<Identity?> GetIdentity(
        UserId userId,
        CancellationToken cancellationToken);

    Task<bool> Update(Identity identity, CancellationToken cancellationToken);
}