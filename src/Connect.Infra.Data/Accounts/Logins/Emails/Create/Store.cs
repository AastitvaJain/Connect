namespace Connect.Accounts.Logins.Emails.Create;

internal sealed class Store(IDbService dbService) : IStore
{
    private readonly ConnectDbContext _context = dbService.DbContext;
    
    public async Task<Identity?> GetIdentity(EmailId emailId, CancellationToken cancellationToken)
    {
        return await _context.ReadOnlySet<AccountDao>().Where(x => x.EmailId == emailId)
            .Select(x => new Identity(new UserId(x.Id), x.State, x.Password))
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<Account?> GetUpdatedAccount(Identity identity, DateTime currentTime, CancellationToken cancellationToken)
    {
        AccountDao? dao = await _context.Accounts.FindAsync(identity.Id.Value, cancellationToken);
        
        if(dao is null)
            return null;

        dao.Auth = identity.Auth!;
        dao.UpdatedAt = currentTime;
        
        await _context.SaveChangesAsync(cancellationToken);

        return new Account(dao.Id, dao.EmailId, dao.Group, dao.State, dao.Name, dao.Auth);
    } 
}