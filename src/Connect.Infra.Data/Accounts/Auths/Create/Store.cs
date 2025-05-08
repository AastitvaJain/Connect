namespace Connect.Accounts.Auths.Create;

internal sealed class Store(ConnectDbContext context) : IStore
{
    public async Task<Identity?> GetIdentity(UserId userId, CancellationToken cancellationToken)
    {
        return await context.ReadOnlySet<AccountDao>().Where(x => x.Id == userId.Value)
            .Select(x => new Identity(new UserId(x.Id), x.Group, x.State, x.Auth))
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<bool> Update(Identity identity, DateTime currentTime, CancellationToken cancellationToken)
    {
        AccountDao? dao = await context.Accounts.FindAsync(identity.Id.Value, cancellationToken);
        
        if(dao is null)
            return false;
        
        dao.Auth = identity.Auth!;
        dao.UpdatedAt = currentTime;
        
        await context.SaveChangesAsync(cancellationToken);
        
        return true;
    }
}