namespace Connect.Requests.Reject;

internal sealed class Store(ConnectDbContext context) : IStore
{
    public async Task<bool> RequestExists(long requestId, CancellationToken cancellationToken)
    {
        return await context.ApproveRequests.AnyAsync(x => x.Id == requestId, cancellationToken: cancellationToken);
    }

    public async Task<bool> TryReject(long requestId, string reason, UserId userId, DateTime time, CancellationToken cancellationToken)
    {
        var dao = await context.ApproveRequests.SingleOrDefaultAsync(x => x.Id == requestId, cancellationToken);
        
        if(dao is null)
            return false;

        dao.Status = RequestStatus.Rejected;
        dao.Note = reason;
        dao.UpdatedBy = userId.Value;
        dao.UpdatedAt = time;
        
        await context.SaveChangesAsync(cancellationToken);
        
        return true;
    }
}