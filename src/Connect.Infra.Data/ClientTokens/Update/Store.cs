namespace Connect.ClientTokens.Update;

internal sealed class Store(IDbService dbService) : IStore
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
            dao.SellRecords?.Select(x => new PropertyRecord(x.Id, x.Rate, x.PaymentPlan)).ToList(),
            dao.BuyRecords?.Select(x => new PropertyRecord(x.Id, x.Rate, x.PaymentPlan)).ToList(),
            dao.ClientPayment is not null ? new ClientPayment(
                dao.ClientPayment.AmountPaid,
                dao.ClientPayment.PaymentMode,
                dao.ClientPayment.PaymentId,
                dao.ClientPayment.ChannelPartnerId,
                dao.ClientPayment.CustomChannelPartnerName,
                dao.ClientPayment.CustomChannelPartnerNumber) : null);
    }

    public async Task<bool> TryUpdate(Client client, UserId userId, CancellationToken cancellationToken)
{
    var token = client.Token;

    ClientDao? dao = await _context.Clients
        .Include(c => c.ClientPayment)
        .Include(c => c.SellRecords)
        .Include(c => c.BuyRecords)
        .FirstOrDefaultAsync(c =>
                c.Id == token.Id &&
                c.Sequence == token.Sequence,
            cancellationToken);

    if (dao is null)
        return false;

    dao.Name = client.Name;
    dao.EmailId = client.EmailId;
    dao.PhoneNo = client.PhoneNo;

    if (client.Payment is not null)
    {
        if (dao.ClientPayment is null)
        {
            dao.ClientPayment = new ClientPaymentDao()
            {
                AmountPaid = client.Payment.AmountPaid,
                PaymentMode = client.Payment.PaymentMode,
                PaymentId = client.Payment.PaymentId,
                ClientId = dao.Id,
                ClientSequence = dao.Sequence,
                ChannelPartnerId = client.Payment.ChannelPartnerId,
                CustomChannelPartnerName = client.Payment.CustomChannelPartnerName,
                CustomChannelPartnerNumber = client.Payment.CustomChannelPartnerNumber,
            };
        }
        else
        {
            dao.ClientPayment.AmountPaid = client.Payment.AmountPaid;
            dao.ClientPayment.PaymentMode = client.Payment.PaymentMode;
            dao.ClientPayment.PaymentId = client.Payment.PaymentId;
            dao.ClientPayment.ChannelPartnerId = client.Payment.ChannelPartnerId;
            dao.ClientPayment.CustomChannelPartnerName = client.Payment.CustomChannelPartnerName;
            dao.ClientPayment.CustomChannelPartnerNumber = client.Payment.CustomChannelPartnerNumber;
        }
    }

    if (client.SellRecords is not null && client.SellRecords.Count > 0)
    {
        _context.PropertyRecords.RemoveRange(dao.SellRecords ?? []);
        
        dao.SellRecords = client.SellRecords?
            .Select(x => new PropertyRecordDao
            {
                PropertyRecordId = x.Id,
                Rate = x.Rate,
                PaymentPlan = x.PaymentPlan,
                SellerId = dao.Id,
                SellerSequence = dao.Sequence
            }).ToList();
    }

    if (client.BuyRecords is not null && client.BuyRecords.Count > 0)
    {
        _context.PropertyRecords.RemoveRange(dao.BuyRecords ?? []);
        
        dao.BuyRecords = client.BuyRecords?
            .Select(x => new PropertyRecordDao
            {
                PropertyRecordId = x.Id,
                Rate = x.Rate,
                PaymentPlan = x.PaymentPlan,
                BuyerId = dao.Id,
                BuyerSequence = dao.Sequence
            }).ToList();
    }
    
    await _context.SaveChangesAsync(cancellationToken);

    return true;
}

}