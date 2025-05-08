namespace Connect.Configs.ChannelPartners.Get;

internal sealed class Store(ConnectDbContext context) : IStore
{
    public async Task<IEnumerable<ChannelPartner>?> GetList()
    {
        return await context.ReadOnlySet<ChannelPartnerDao>()
            .Select(x => new ChannelPartner(x.Id, x.Name))
            .ToListAsync();
    }
}