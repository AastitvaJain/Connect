namespace Connect.Inventories.New.Get;

internal sealed class Store(IDbService dbService) : IStore
{
    private readonly ConnectDbContext _context = dbService.DbContext;
    public async Task<IEnumerable<NewInventory>?> GetList(
        int pageNo, int pageSize, string? projectNameFilter, string? unitNoFilter,
        CancellationToken cancellationToken)
    {
        var query = _context.NewInventory.AsQueryable();
        
        if(!string.IsNullOrWhiteSpace(projectNameFilter))
            query = query.Where(x => x.ProjectName == projectNameFilter);
        
        if(!string.IsNullOrWhiteSpace(unitNoFilter))
            query = query.Where(x => x.UnitNo == unitNoFilter);
        
        query = query
            .OrderBy(x => x.ProjectName)
            .Skip((pageNo - 1) * pageSize)
            .Take(pageSize);
        
        return await query.Select(x => new NewInventory(
            x.Id,
            x.ProjectName,
            x.ProjectType,
            x.UnitNo,
            x.BuiltUpArea,
            x.Rate,
            x.TotalConsideration,
            x.RevisedRate,
            x.RevisedTotalConsideration)).ToListAsync(cancellationToken);
    }
}