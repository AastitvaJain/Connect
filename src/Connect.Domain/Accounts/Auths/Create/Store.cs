namespace Connect.Accounts.Auths.Create;

public interface IStore
{
    Task<Identity?> GetIdentity(
        UserId userId,
        CancellationToken cancellationToken);
    
    Task<bool> Update(Identity identity, DateTime currentTime, CancellationToken cancellationToken);
}