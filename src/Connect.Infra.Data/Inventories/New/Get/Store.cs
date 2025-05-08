namespace Connect.Inventories.New.Get;

internal sealed class Store(ConnectDbContext context) : IStore
{
    public async Task<PagedResult<NewInventory>?> GetList(
        int pageNo, int pageSize, string? projectNameFilter, string? unitNoFilter,
        CancellationToken cancellationToken)
    {
        var query = context.ReadOnlySet<NewInventoryDao>().AsQueryable();
        
        if(!string.IsNullOrWhiteSpace(projectNameFilter))
            query = query.Where(x => x.ProjectName.ToLower().Contains(projectNameFilter.ToLower()));
        
        if(!string.IsNullOrWhiteSpace(unitNoFilter))
            query = query.Where(x => x.UnitNo.ToLower().Contains(unitNoFilter.ToLower()));
        
        var totalCount = await query.CountAsync(cancellationToken);

        query = query
            .OrderBy(x => x.ProjectName)
            .Skip((pageNo - 1) * pageSize)
            .Take(pageSize);
        
        var results =  await query.ToListAsync(cancellationToken);

        return new PagedResult<NewInventory>()
        {
            TotalCount = totalCount,
            PageNumber = pageNo,
            PageSize = pageSize,
            Items = results.Select(NewInventoryDao.ToNewInventory).ToList()
        };
    }
}