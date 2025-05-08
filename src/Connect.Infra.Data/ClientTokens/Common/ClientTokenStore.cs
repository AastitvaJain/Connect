namespace Connect.ClientTokens;

internal class ClientTokenStore(ConnectDbContext context)
{
    public async Task<Client?> Get(ClientToken clientToken, CancellationToken cancellationToken)
    {
        ClientDao? dao = await context.Clients
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
    
    public async Task<List<SoldInventory>?> GetSoldInventories(ClientToken clientToken, CancellationToken cancellationToken)
    {
        List<PropertyRecordDao> records = await context.PropertyRecords
            .Where(x => x.SellerId == clientToken.Id && x.SellerSequence == clientToken.Sequence)
            .ToListAsync(cancellationToken);

        if (records.Count == 0)
        {
            return null;
        }
        
        List<SoldInventoryDao> daos = await context.SoldInventory
            .Where(x => records.Select(r => r.PropertyRecordId).Contains(x.Id))
            .ToListAsync(cancellationToken);
        
        return daos.Select(SoldInventoryDao.ToSoldInventory).ToList();
    }

    public async Task<List<NewInventory>?> GetNewInventories(ClientToken clientToken, CancellationToken cancellationToken)
    {
        List<PropertyRecordDao> records = await context.PropertyRecords
            .Where(x => x.BuyerId == clientToken.Id && x.BuyerSequence == clientToken.Sequence)
            .ToListAsync(cancellationToken);
        
        if (records.Count == 0)
        {
            return null;
        }
        
        List<NewInventoryDao> daos = await context.NewInventory
            .Where(x => records.Select(r => r.PropertyRecordId).Contains(x.Id))
            .ToListAsync(cancellationToken);
        
        return daos.Select(NewInventoryDao.ToNewInventory).ToList();
    }
}