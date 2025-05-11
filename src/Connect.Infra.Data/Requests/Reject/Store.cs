namespace Connect.Requests.Reject;

internal sealed class Store(ConnectDbContext context) : RequestStore(context), IStore
{
    private readonly ConnectDbContext _context = context;
    public async Task<bool> TryReject(long requestId, string reason, UserId userId, DateTime time, CancellationToken cancellationToken)
    {
        var dao = await _context.ApproveRequests.SingleOrDefaultAsync(x => x.Id == requestId, cancellationToken);
        
        if(dao is null)
            return false;

        dao.Status = RequestStatus.Rejected;
        dao.Note = reason;
        dao.UpdatedBy = userId.Value;
        dao.UpdatedAt = time;
        
        await _context.SaveChangesAsync(cancellationToken);
        
        return true;
    }
}