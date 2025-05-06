namespace Connect.Configs.Inventories.New.ProjectName.Get;

internal sealed class Store(IDbService dbService) : IStore
{
    private readonly ConnectDbContext _context = dbService.DbContext;
    
    public async Task<IEnumerable<string>?> GetList()
    {
        return await _context.NewInventory.
            Select(x => x.ProjectName)
            .Distinct()
            .ToListAsync();
    }
}