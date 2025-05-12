namespace Connect.Requests;

internal class RequestStore(ConnectDbContext context)
{
    public async Task<bool> TokenExists(ClientToken token, CancellationToken cancellationToken)
    {
        return await context.Clients.AnyAsync(x => x.Id == token.Id && x.Sequence == token.Sequence,
            cancellationToken: cancellationToken);
    }

    public async Task<bool> RequestExists(ClientToken token, CancellationToken cancellationToken)
    {
        return await context.Clients.AnyAsync(
            x => 
                x.Id == token.Id && x.Sequence == token.Sequence &&
                x.ApproveRequests != null && x.ApproveRequests.Any(y => y.Status == RequestStatus.Pending),
            cancellationToken: cancellationToken);
    }
    
    public async Task<bool> RequestExists(long requestId, CancellationToken cancellationToken)
    {
        return await context.ApproveRequests.AnyAsync(x => x.Id == requestId && x.Status == RequestStatus.Pending,
            cancellationToken: cancellationToken);
    }
}