namespace Connect.Requests.Get.ByStatus;

internal sealed class Store(ConnectDbContext context) : IStore
{
    public async Task<PagedResult<ApproveRequest>> GetList(int page, int pageSize, RequestStatus status, CancellationToken cancellationToken)
    {
        var daos = await context.ApproveRequests.Where(x => x.Status == status)
            .Include(x => x.Client)
            .Include(x => x.SellPropertyChanges)
            .Include(x => x.BuyPropertyChanges)
            .Include(x => x.CostSheets)
            .ThenInclude(x => x.Items)
            .AsSplitQuery()
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
        
        var count = await context.ApproveRequests.CountAsync(x => x.Status == status, cancellationToken);

        return new PagedResult<ApproveRequest>()
        {
            PageNumber = page,
            PageSize = pageSize,
            TotalCount = count,
            Items = daos.Select(x => new ApproveRequest(
                x.Status,
                x.SellPropertyChanges?.Select(ApprovalPropertyRecordDao.ToDomain).ToList(),
                x.BuyPropertyChanges.Select(ApprovalPropertyRecordDao.ToDomain).ToList(),
                x.CostSheets.Select(ApprovalCostSheetDao.ToDomain).ToList(),
                x.IsApplied,
                x.Note,
                x.Id,
                x.Client is not null
                    ? new Client(
                        new ClientToken(x.Client.Id, x.Client.Sequence),
                        new Name(x.Client.Name),
                        x.Client.EmailId is not null ? new EmailId(x.Client.EmailId) : null,
                        x.Client.PhoneNo,
                        null,
                        null,
                        null,
                        x.Client.IsSubmitted)
                    : null))
        };
    }

    public async Task<List<SoldInventory>?> GetSoldInventories(List<Guid> ids, CancellationToken cancellationToken)
    {
        var daos = await context.SoldInventory.Where(x => ids.Contains(x.Id))
            .ToListAsync(cancellationToken);

        return daos.Select(SoldInventoryDao.ToSoldInventory).ToList();
    }

    public async Task<List<NewInventory>?> GetNewInventories(List<Guid> ids, CancellationToken cancellationToken)
    {
        var daos = await context.NewInventory.Where(x => ids.Contains(x.Id))
            .ToListAsync(cancellationToken);
        
        return daos.Select(NewInventoryDao.ToNewInventory).ToList();   
    }
}