namespace Connect.Inventories.Sold.Get;

internal sealed class Store(ConnectDbContext context) : IStore
{
    public async Task<PagedResult<SoldInventory>?> GetList(
        int pageNo, 
        int pageSize, 
        string? projectNameFilter, 
        string? unitNoFilter, 
        string? buyerNameFilter,
        CancellationToken cancellationToken)
    {
        var query = context.ReadOnlySet<SoldInventoryDao>().AsQueryable();

        if (!string.IsNullOrWhiteSpace(projectNameFilter))
            query = query.Where(x => x.ProjectName.ToLower().Contains(projectNameFilter.ToLower()));

        if (!string.IsNullOrWhiteSpace(unitNoFilter))
            query = query.Where(x => x.UnitNo.ToLower().Contains(unitNoFilter.ToLower()));

        if (!string.IsNullOrWhiteSpace(buyerNameFilter))
            query = query.Where(x => x.BuyerName.ToLower().Contains(buyerNameFilter.ToLower()));

        var totalCount = await query.CountAsync(cancellationToken);

        query = query
            .OrderBy(x => x.ProjectName) 
            .Skip((pageNo - 1) * pageSize)
            .Take(pageSize);
        
        var results = await query
            .ToListAsync(cancellationToken);

        return new PagedResult<SoldInventory>()
        {
            TotalCount = totalCount,
            PageNumber = pageNo,
            PageSize = pageSize,
            Items = results.Select(SoldInventoryDao.ToSoldInventory).ToList()
        };
    }
}