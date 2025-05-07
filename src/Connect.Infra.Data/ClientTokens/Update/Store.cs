namespace Connect.ClientTokens.Update;

internal sealed class Store(IDbService dbService) : ClientTokenStore(dbService), IStore
{
    private readonly ConnectDbContext _context = dbService.DbContext;

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
                    OriginalRate = x.OriginalRate,
                    DraftRate = x.DraftRate,
                    RequestedRate = x.RequestedRate,
                    ApprovedRate = x.ApprovedRate,
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
                    OriginalRate = x.OriginalRate,
                    DraftRate = x.DraftRate,
                    RequestedRate = x.RequestedRate,
                    ApprovedRate = x.ApprovedRate,
                    PaymentPlan = x.PaymentPlan,
                    BuyerId = dao.Id,
                    BuyerSequence = dao.Sequence
                }).ToList();
        }
        
        await _context.SaveChangesAsync(cancellationToken);

        return true;
        
    }

}