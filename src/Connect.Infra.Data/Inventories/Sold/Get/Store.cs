namespace Connect.Inventories.Sold.Get;

internal sealed class Store(ConnectDbContext context) : IStore
{
    public async Task<IEnumerable<SoldInventory>?> GetList(
        int pageNo, 
        int pageSize, 
        string? projectNameFilter, 
        string? unitNoFilter, 
        string? buyerNameFilter,
        CancellationToken cancellationToken)
    {
        var query = context.SoldInventory.AsQueryable();

        if (!string.IsNullOrWhiteSpace(projectNameFilter))
            query = query.Where(x => x.ProjectName.Contains(projectNameFilter));

        if (!string.IsNullOrWhiteSpace(unitNoFilter))
            query = query.Where(x => x.UnitNo.Contains(unitNoFilter));

        if (!string.IsNullOrWhiteSpace(buyerNameFilter))
            query = query.Where(x => x.BuyerName.Contains(buyerNameFilter));

        query = query
            .OrderBy(x => x.ProjectName) 
            .Skip((pageNo - 1) * pageSize)
            .Take(pageSize);

        var results = await query
            .ToListAsync(cancellationToken); 

        return results.Select(SoldInventoryDao.ToSoldInventory).ToList();
    }
}