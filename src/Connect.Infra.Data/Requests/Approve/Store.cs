namespace Connect.Requests.Approve;

internal sealed class Store(ConnectDbContext context) : RequestStore(context) ,IStore
{
    private readonly ConnectDbContext _context = context;
    
    public async Task<bool> TryApprove(long requestId, ApproveRequest request, UserId userId, DateTime time,
        CancellationToken cancellationToken)
    {
        var dao = await _context.ApproveRequests
            .Include(x => x.SellPropertyChanges)
            .Include(x => x.BuyPropertyChanges)
            .Include(x => x.CostSheets)
            .ThenInclude(x => x.Items)
            .AsSplitQuery()
            .SingleOrDefaultAsync(x => x.Id == requestId, cancellationToken);
        
        if(dao is null)
            return false;
        
        // Mark all other records as not applied
        await _context.ApproveRequests
            .Where(x => x.ClientId == dao.ClientId && x.ClientSequence == dao.ClientSequence && x.IsApplied)
            .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.IsApplied, false),
                cancellationToken);
        
        _context.ApprovalPropertyRecords.RemoveRange(dao.SellPropertyChanges ?? []);
        _context.ApprovalPropertyRecords.RemoveRange(dao.BuyPropertyChanges);
        
        dao.Status = RequestStatus.Approved;
        dao.SellPropertyChanges = request.SellPropertyChanges?.Select(ApprovalPropertyRecordDao.ToDao).ToList();
        dao.BuyPropertyChanges = request.BuyPropertyChanges.Select(ApprovalPropertyRecordDao.ToDao).ToList();
        dao.CostSheets = request.CostSheets.Select(ApprovalCostSheetDao.ToDao).ToList();
        dao.IsApplied = request.IsApplied;
        dao.Note = request.Note;
        dao.UpdatedBy = userId.Value;
        dao.UpdatedAt = time;
        
        await _context.SaveChangesAsync(cancellationToken);
        
        return true;
    }
}