namespace Connect.Configs.Inventories.New.ProjectName.Get;

internal sealed class Store(ConnectDbContext context) : IStore
{
    public async Task<IEnumerable<string>?> GetList()
    {
        return await context.NewInventory.
            Select(x => x.ProjectName)
            .Distinct()
            .ToListAsync();
    }
}