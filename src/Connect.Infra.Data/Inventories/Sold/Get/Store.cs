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
        var query = from si in _context.SoldInventory
            join ap in _context.AssuredPrice
                on si.UniqueKey equals ap.UniqueKey into priceJoin
            from ap in priceJoin.DefaultIfEmpty()
            select new { si, ap };

        // Apply filters if provided
        if (!string.IsNullOrWhiteSpace(projectNameFilter))
            query = query.Where(x => x.si.ProjectName.Contains(projectNameFilter));

        if (!string.IsNullOrWhiteSpace(unitNoFilter))
            query = query.Where(x => x.si.UnitNo.Contains(unitNoFilter));

        if (!string.IsNullOrWhiteSpace(buyerNameFilter))
            query = query.Where(x => x.si.BuyerName.Contains(buyerNameFilter));

        // Apply paging
        query = query
            .OrderBy(x => x.si.ProjectName) // Or use CreatedAt if you have it
            .Skip((pageNo - 1) * pageSize)
            .Take(pageSize);

        var results = await query
            .ToListAsync(cancellationToken); // Execute query first

        // Convert to SoldInventory with parsing in C#
        return results.Select(x => new SoldInventory(
            x.si.Id,
            x.si.BookingId,
            x.si.BookingDate,
            x.si.ProjectName,
            x.si.ProjectType,
            x.si.UnitNo,
            x.si.UniqueKey,
            x.si.BuyerName,
            x.si.BuiltUpArea,
            x.si.Rate,
            x.si.TotalConsideration,
            x.si.NetReceived,
            float.TryParse(x.ap?.AssuredPrice, out float value) ? value : 0,
            x.ap?.RevisedAssuredPrice
        )).ToList();
    }
}