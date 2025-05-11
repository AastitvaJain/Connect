namespace Connect.ClientTokens;

internal class ClientTokenStore(ConnectDbContext context)
{
    public async Task<Client?> Get(ClientToken clientToken, CancellationToken cancellationToken)
    {
        ClientDao? dao = await context.ReadOnlySet<ClientDao>()
            .Where(c => c.Id == clientToken.Id && c.Sequence == clientToken.Sequence)
            .Include(c => c.SellRecords)
            .Include(c => c.BuyRecords)
            .Include(c => c.ClientPayment)
            .AsSplitQuery()
            .FirstOrDefaultAsync(cancellationToken);
        
        if(dao is null)
            return null;

        return new Client(
            new ClientToken(dao.Id, dao.Sequence),
            new Name(dao.Name, false),
            dao.EmailId is null ? null : new EmailId(dao.EmailId),
            dao.PhoneNo,
            dao.SellRecords?.Select(x => new PropertyRecord(x.PropertyRecordId, x.OriginalRate, x.DraftRate, x.RequestedRate, x.ApprovedRate, x.PaymentPlan)).ToList(),
            dao.BuyRecords?.Select(x => new PropertyRecord(x.PropertyRecordId, x.OriginalRate, x.DraftRate, x.RequestedRate, x.ApprovedRate, x.PaymentPlan)).ToList(),
            dao.ClientPayment is not null ? new ClientPayment(
                dao.ClientPayment.AmountPaid,
                dao.ClientPayment.PaymentMode,
                dao.ClientPayment.PaymentId,
                dao.ClientPayment.ChannelPartnerId,
                dao.ClientPayment.CustomChannelPartnerName,
                dao.ClientPayment.CustomChannelPartnerNumber) : null,
            dao.IsSubmitted);
    }
    
    public async Task<bool> CheckSellRecords(List<PropertyRecord> sellRecords, CancellationToken cancellationToken)
    {
        var recordIds = sellRecords.Select(x => x.Id).ToList();

        var matchedCount = await context.ReadOnlySet<SoldInventoryDao>()
            .CountAsync(x => recordIds.Contains(x.Id), cancellationToken);

        return matchedCount == recordIds.Count;
    }
    
    public async Task<bool> CheckBuyRecords(List<PropertyRecord> buyRecords, CancellationToken cancellationToken)
    {
        var recordIds = buyRecords.Select(x => x.Id).ToList();

        var matchedCount = await context.ReadOnlySet<NewInventoryDao>()
            .CountAsync(x => recordIds.Contains(x.Id), cancellationToken);

        return matchedCount == recordIds.Count;
    }
    
    public async Task<List<SoldInventory>?> GetSoldInventories(ClientToken clientToken, CancellationToken cancellationToken)
    {
        List<PropertyRecordDao> records = await context.ReadOnlySet<PropertyRecordDao>()
            .Where(x => x.SellerId == clientToken.Id && x.SellerSequence == clientToken.Sequence)
            .ToListAsync(cancellationToken);

        if (records.Count == 0)
        {
            return null;
        }
        
        List<SoldInventoryDao> daos = await context.ReadOnlySet<SoldInventoryDao>()
            .Where(x => records.Select(r => r.PropertyRecordId).Contains(x.Id))
            .ToListAsync(cancellationToken);
        
        return daos.Select(SoldInventoryDao.ToSoldInventory).ToList();
    }

    public async Task<List<NewInventory>?> GetNewInventories(ClientToken clientToken, CancellationToken cancellationToken)
    {
        List<PropertyRecordDao> records = await context.ReadOnlySet<PropertyRecordDao>()
            .Where(x => x.BuyerId == clientToken.Id && x.BuyerSequence == clientToken.Sequence)
            .ToListAsync(cancellationToken);
        
        if (records.Count == 0)
        {
            return null;
        }
        
        List<NewInventoryDao> daos = await context.ReadOnlySet<NewInventoryDao>()
            .Where(x => records.Select(r => r.PropertyRecordId).Contains(x.Id))
            .ToListAsync(cancellationToken);
        
        return daos.Select(NewInventoryDao.ToNewInventory).ToList();
    }
}