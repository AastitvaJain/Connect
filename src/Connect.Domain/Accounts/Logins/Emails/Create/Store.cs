namespace Connect.Accounts.Logins.Emails.Create;

public interface IStore
{
    Task<Identity?> GetIdentity(
        EmailId emailId,
        CancellationToken cancellationToken);
    
    Task<Account?> GetUpdatedAccount(
        Identity identity,
        DateTime currentTime,
        CancellationToken cancellationToken);
}