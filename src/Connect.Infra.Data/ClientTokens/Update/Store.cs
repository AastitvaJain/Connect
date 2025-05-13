namespace Connect.ClientTokens.Update;

internal sealed class Store(ConnectDbContext context) : ClientTokenStore(context), IStore
{
    private readonly ConnectDbContext _context = context;

    public async Task<bool> TryUpdate(Client client, UserId userId, DateTime time, CancellationToken cancellationToken)
    {
        var token = client.Token;

        ClientDao? dao = await _context.Clients
            .Include(c => c.ClientPayment)
            .Include(c => c.SellRecords)
            .Include(c => c.BuyRecords)
            .AsSplitQuery()
            .FirstOrDefaultAsync(c =>
                    c.Id == token.Id &&
                    c.Sequence == token.Sequence,
                cancellationToken);

        if (dao is null)
            return false;

        dao.Name = client.Name;
        dao.EmailId = client.EmailId;
        dao.PhoneNo = client.PhoneNo;
        dao.IsSubmitted = client.IsSubmitted;

        if (client.Payment is not null)
        {
            float totalSellAmount = 0;
            float totalBuyAmount = 0;

            foreach (PropertyRecord clientSellRecord in client.SellRecords ?? [])
            {
                var area = await _context.SoldInventory.Where(x => x.Id == clientSellRecord.Id)
                    .Select(x => x.BuiltUpArea)
                    .SingleOrDefaultAsync(cancellationToken);
                
                totalSellAmount += clientSellRecord.ApprovedRate ?? clientSellRecord.OriginalRate * area;
            }

            foreach (PropertyRecord clientBuyRecord in client.BuyRecords ?? [])
            {
                var area = await _context.NewInventory.Where(x => x.Id == clientBuyRecord.Id)
                    .Select(x => x.BuiltUpArea)
                    .SingleOrDefaultAsync(cancellationToken);
                
                totalBuyAmount += clientBuyRecord.ApprovedRate ?? clientBuyRecord.OriginalRate * area;
            }
            
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
                    TotalSellAmount = totalSellAmount,
                    TotalBuyAmount = totalBuyAmount,
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
                dao.ClientPayment.TotalSellAmount = totalSellAmount;
                dao.ClientPayment.TotalBuyAmount = totalBuyAmount;
            }
        }
        
        if (dao.SellRecords?.Count > 0)
            _context.PropertyRecords.RemoveRange(dao.SellRecords);

        dao.SellRecords = client.SellRecords?
            .Select(x => new PropertyRecordDao
            {
                PropertyRecordId = x.Id,
                OriginalRate = x.OriginalRate,
                DraftRate = x.DraftRate,
                RequestedRate = x.RequestedRate,
                ApprovedRate = x.ApprovedRate,
                PaymentPlan = x.PaymentPlan
            }).ToList() ?? [];

        
        if (dao.BuyRecords?.Count > 0)
            _context.PropertyRecords.RemoveRange(dao.BuyRecords);

        dao.BuyRecords = client.BuyRecords?
            .Select(x => new PropertyRecordDao
            {
                PropertyRecordId = x.Id,
                OriginalRate = x.OriginalRate,
                DraftRate = x.DraftRate,
                RequestedRate = x.RequestedRate,
                ApprovedRate = x.ApprovedRate,
                PaymentPlan = x.PaymentPlan,
                BuyerId = token.Id,
                BuyerSequence = token.Sequence
            }).ToList() ?? [];

        
        dao.UpdatedBy = userId.Value;
        dao.UpdatedAt = time;
            
        try
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateConcurrencyException ex)
        {
            foreach (var entry in ex.Entries)
            {
                Console.WriteLine("Concurrency conflict on:");
                Console.WriteLine($"Entity type: {entry.Entity.GetType().Name}");
                Console.WriteLine($"Entity state: {entry.State}");

                // Optional: print primary key values
                var pk = _context.Entry(entry.Entity).Properties
                    .Where(p => p.Metadata.IsPrimaryKey())
                    .ToDictionary(p => p.Metadata.Name, p => p.CurrentValue);

                foreach (var kvp in pk)
                {
                    Console.WriteLine($"  PK {kvp.Key} = {kvp.Value}");
                }
            }

            return false;
        }
        
        return true;
        
    }

}