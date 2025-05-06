namespace Connect.Configs.ChannelPartners.Get;

internal sealed class Store(IDbService dbService) : IStore
{
    private readonly ConnectDbContext _context = dbService.DbContext;
    
    public async Task<IEnumerable<ChannelPartner>?> GetList()
    {
        return await _context.ChannelPartners
            .Select(x => new ChannelPartner(x.Id, x.Name))
            .ToListAsync();
    }
}