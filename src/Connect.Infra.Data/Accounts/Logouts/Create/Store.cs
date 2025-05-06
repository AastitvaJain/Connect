namespace Connect.Accounts.Logouts.Create;

internal sealed class Store(IDbService dbService) : IStore
{
    private readonly ConnectDbContext _context = dbService.DbContext;
    
    public async Task<Identity?> GetIdentity(UserId userId, CancellationToken cancellationToken)
    {
        return await _context.ReadOnlySet<AccountDao>().Where(x => x.Id == userId.Value)
            .Select(x => new Identity(new UserId(x.Id), x.Auth))
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<bool> Update(Identity identity, CancellationToken cancellationToken)
    {
        AccountDao? dao = await _context.Accounts.FindAsync(identity.Id.Value, cancellationToken);
        
        if(dao is null)
            return false;
        
        dao.Auth = identity.Auth!;
        dao.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync(cancellationToken);
        
        return true;
    }
}