namespace Connect.ClientTokens;

internal class ClientTokenStore(IDbService dbService)
{
    private readonly ConnectDbContext _context = dbService.DbContext;
    
    public async Task<Client?> Get(ClientToken clientToken, CancellationToken cancellationToken)
    {
        ClientDao? dao = await _context.Clients
            .Where(c => c.Id == clientToken.Id && c.Sequence == clientToken.Sequence)
            .Include(c => c.SellRecords)
            .Include(c => c.BuyRecords)
            .Include(c => c.ClientPayment)
            .FirstOrDefaultAsync(cancellationToken);
        
        if(dao is null)
            return null;

        return new Client(
            new ClientToken(dao.Id, dao.Sequence),
            new Name(dao.Name, false),
            dao.EmailId is null ? null : new EmailId(dao.EmailId),
            dao.PhoneNo,
            dao.SellRecords?.Select(x => new PropertyRecord(x.Id, x.OriginalRate, x.DraftRate, x.RequestedRate, x.ApprovedRate, x.PaymentPlan)).ToList(),
            dao.BuyRecords?.Select(x => new PropertyRecord(x.Id, x.OriginalRate, x.DraftRate, x.RequestedRate, x.ApprovedRate, x.PaymentPlan)).ToList(),
            dao.ClientPayment is not null ? new ClientPayment(
                dao.ClientPayment.AmountPaid,
                dao.ClientPayment.PaymentMode,
                dao.ClientPayment.PaymentId,
                dao.ClientPayment.ChannelPartnerId,
                dao.ClientPayment.CustomChannelPartnerName,
                dao.ClientPayment.CustomChannelPartnerNumber) : null);
    }
}