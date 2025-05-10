namespace Connect.Configs.Inventories.Sold.UnitNo.Get;

internal sealed class Store(ConnectDbContext context) : IStore
{
    public async Task<IEnumerable<string>?> GetList()
    {
        return await context.ReadOnlySet<SoldInventoryDao>().
            Select(x => x.UnitNo)
            .Distinct()
            .ToListAsync();
    }
}