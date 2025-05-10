namespace Connect.Configs.Inventories.New.UnitNo.Get;

internal sealed class Store(ConnectDbContext context) : IStore
{
    public async Task<IEnumerable<string>?> GetList()
    {
        return await context.ReadOnlySet<NewInventoryDao>().
            Select(x => x.UnitNo)
            .Distinct()
            .ToListAsync();
    }
}