namespace Connect.Inventories.Sold.Get;

internal sealed class Store(IDbService dbService) : IStore
{
    private readonly ConnectDbContext _context = dbService.DbContext;
    
    public async Task<IEnumerable<SoldInventory>?> GetList(
        int pageNo, 
        int pageSize, 
        string? projectNameFilter, 
        string? unitNoFilter, 
        string? buyerNameFilter,
        CancellationToken cancellationToken)
    {
        var query = _context.SoldInventory.AsQueryable();

        // Apply filters if provided
        if (!string.IsNullOrWhiteSpace(projectNameFilter))
            query = query.Where(x => x.ProjectName.Contains(projectNameFilter));

        if (!string.IsNullOrWhiteSpace(unitNoFilter))
            query = query.Where(x => x.UnitNo.Contains(unitNoFilter));

        if (!string.IsNullOrWhiteSpace(buyerNameFilter))
            query = query.Where(x => x.BuyerName.Contains(buyerNameFilter));

        // Apply paging
        query = query
            .OrderBy(x => x.ProjectName) // Or use CreatedAt if you have it
            .Skip((pageNo - 1) * pageSize)
            .Take(pageSize);

        return await query.Select(x => new SoldInventory(
            x.Id,
            x.BookingId,
            x.BookingDate,
            x.ProjectName,
            x.ProjectType,
            x.UnitNo,
            x.UniqueKey,
            x.BuyerName,
            x.BuiltUpArea,
            x.Rate,
            x.TotalConsideration,
            x.NetReceived)).ToListAsync(cancellationToken);
    }
}