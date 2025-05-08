namespace Connect.ClientTokens.Update;

internal sealed class Store(ConnectDbContext context) : ClientTokenStore(context), IStore
{
    private readonly ConnectDbContext _context = context;

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
            // 1. Track incoming IDs
            var incomingIds = client.SellRecords.Select(x => x.Id).ToHashSet();

            // 2. Remove obsolete records
            var toRemove = dao.SellRecords?
                .Where(x => !incomingIds.Contains(x.PropertyRecordId))
                .ToList();

            if (toRemove?.Count > 0)
                _context.PropertyRecords.RemoveRange(toRemove);

            // 3. Add new or update existing
            foreach (var incoming in client.SellRecords)
            {
                var existing = dao.SellRecords?.FirstOrDefault(x => x.PropertyRecordId == incoming.Id);

                if (existing is not null)
                {
                    // Update fields
                    existing.OriginalRate = incoming.OriginalRate;
                    existing.DraftRate = incoming.DraftRate;
                    existing.RequestedRate = incoming.RequestedRate;
                    existing.ApprovedRate = incoming.ApprovedRate;
                    existing.PaymentPlan = incoming.PaymentPlan;
                }
                else
                {
                    dao.SellRecords?.Add(new PropertyRecordDao
                    {
                        PropertyRecordId = incoming.Id,
                        OriginalRate = incoming.OriginalRate,
                        DraftRate = incoming.DraftRate,
                        RequestedRate = incoming.RequestedRate,
                        ApprovedRate = incoming.ApprovedRate,
                        PaymentPlan = incoming.PaymentPlan,
                        SellerId = dao.Id,
                        SellerSequence = dao.Sequence
                    });
                }
            }
        }


        if (client.BuyRecords is not null && client.BuyRecords.Count > 0)
        {
            var incomingIds = client.BuyRecords.Select(x => x.Id).ToHashSet();

            // 1. Remove obsolete records
            var toRemove = dao.BuyRecords?
                .Where(x => !incomingIds.Contains(x.PropertyRecordId))
                .ToList();

            if (toRemove?.Count > 0)
                _context.PropertyRecords.RemoveRange(toRemove);

            // 2. Add or update records
            foreach (var incoming in client.BuyRecords)
            {
                var existing = dao.BuyRecords?.FirstOrDefault(x => x.PropertyRecordId == incoming.Id);

                if (existing is not null)
                {
                    // Update fields
                    existing.OriginalRate = incoming.OriginalRate;
                    existing.DraftRate = incoming.DraftRate;
                    existing.RequestedRate = incoming.RequestedRate;
                    existing.ApprovedRate = incoming.ApprovedRate;
                    existing.PaymentPlan = incoming.PaymentPlan;
                }
                else
                {
                    dao.BuyRecords?.Add(new PropertyRecordDao
                    {
                        PropertyRecordId = incoming.Id,
                        OriginalRate = incoming.OriginalRate,
                        DraftRate = incoming.DraftRate,
                        RequestedRate = incoming.RequestedRate,
                        ApprovedRate = incoming.ApprovedRate,
                        PaymentPlan = incoming.PaymentPlan,
                        BuyerId = dao.Id,
                        BuyerSequence = dao.Sequence
                    });
                }
            }
        }

        
        await _context.SaveChangesAsync(cancellationToken);

        return true;
        
    }

}