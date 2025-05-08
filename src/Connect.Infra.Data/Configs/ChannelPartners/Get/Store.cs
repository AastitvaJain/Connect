namespace Connect.Configs.ChannelPartners.Get;

internal sealed class Store(ConnectDbContext context) : IStore
{
    public async Task<IEnumerable<ChannelPartner>?> GetList()
    {
        return await context.ChannelPartners
            .Select(x => new ChannelPartner(x.Id, x.Name))
            .ToListAsync();
    }
}