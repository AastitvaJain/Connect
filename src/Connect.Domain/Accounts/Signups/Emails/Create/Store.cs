namespace Connect.Accounts.Signups.Emails.Create;

public interface IStore
{
    Task<int> Count(EmailId emailId, CancellationToken cancellationToken);
    
    Task<UserId?> CreateAccountId(CancellationToken cancellationToken);
    
    Task<bool> TryAdd(Account account, CancellationToken cancellationToken);
}