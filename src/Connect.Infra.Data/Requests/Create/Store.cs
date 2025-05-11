namespace Connect.Requests.Create;

internal sealed class Store(ConnectDbContext context) : RequestStore(context), IStore
{
    private readonly ConnectDbContext _context = context;
    public async Task<long?> TryCreate(ApproveRequest request, ClientToken token, UserId userId, DateTime time,
        CancellationToken cancellationToken)
    {
        var dao = new ApproveRequestDao()
        {
            ClientId = token.Id,
            ClientSequence = token.Sequence,
            Status = request.Status,
            SellPropertyChanges = request.SellPropertyChanges?.Select(ApprovalPropertyRecordDao.ToDao).ToList(),
            BuyPropertyChanges = request.BuyPropertyChanges.Select(ApprovalPropertyRecordDao.ToDao).ToList(),
            CostSheets = request.CostSheets.Select(ApprovalCostSheetDao.ToDao).ToList(),
            IsApplied = request.IsApplied,
            CreatedBy = userId.Value,
            CreatedAt = time
        };
        
        await _context.ApproveRequests.AddAsync(dao, cancellationToken);

        await _context.SaveChangesAsync(cancellationToken);
        
        return dao.Id;
    }
}