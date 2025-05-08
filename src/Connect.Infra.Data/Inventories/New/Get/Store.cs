namespace Connect.Inventories.New.Get;

internal sealed class Store(ConnectDbContext context) : IStore
{
    public async Task<IEnumerable<NewInventory>?> GetList(
        int pageNo, int pageSize, string? projectNameFilter, string? unitNoFilter,
        CancellationToken cancellationToken)
    {
        var query = context.NewInventory.AsQueryable();
        
        if(!string.IsNullOrWhiteSpace(projectNameFilter))
            query = query.Where(x => x.ProjectName == projectNameFilter);
        
        if(!string.IsNullOrWhiteSpace(unitNoFilter))
            query = query.Where(x => x.UnitNo == unitNoFilter);
        
        query = query
            .OrderBy(x => x.ProjectName)
            .Skip((pageNo - 1) * pageSize)
            .Take(pageSize);
        
        var results =  await query.ToListAsync(cancellationToken);
        
        return results.Select(NewInventoryDao.ToNewInventory).ToList();
    }
}