namespace Connect.Accounts.Signups.Emails.Create;

internal sealed class Store(ConnectDbContext context) : IStore
{
    public Task<int> Count(EmailId emailId, CancellationToken cancellationToken)
    {
        return context.Accounts.CountAsync(
            x => x.EmailId.ToLower() == emailId.Value.ToLower(), 
            cancellationToken);
    }

    public async Task<UserId?> CreateAccountId(CancellationToken cancellationToken)
    {
        for (int attempt = 0; attempt < 3; ++attempt)
        {
            UserId userId = UserId.Create();
            
            int count = await context.Accounts.CountAsync(x => x.Id == userId, cancellationToken);
            
            if (count == 0)
            {
                return userId;
            }
        }
        
        return null;
    }

    public async Task<bool> TryAdd(Account account, CancellationToken cancellationToken)
    {
        AccountDao dao = new AccountDao()
        {
            Id = account.Id,
            Group = account.Group,
            State = account.State,
            EmailId = account.EmailId,
            Name = account.Name,
            Password = account.Password,
            Auth = account.Auth,
        };

        try
        {
            await context.Accounts.AddAsync(dao, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return true;
        }
        catch
        {
            return false;
        }
    }
}