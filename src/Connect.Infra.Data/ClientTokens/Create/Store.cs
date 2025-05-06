namespace Connect.ClientTokens.Create;

internal sealed class Store(IDbService dbService) : IStore
{
    private readonly ConnectDbContext _context = dbService.DbContext;

    public async Task<ClientToken?> AlreadyCreated(List<PropertyRecord> sellRecords, CancellationToken cancellationToken)
    {
        var recordIds = sellRecords.Select(r => r.Id).ToHashSet();
        
        return await _context.Clients
            .Where(client => client.SellRecords != null &&
                             client.SellRecords.Count == recordIds.Count &&
                             client.SellRecords.All(s => recordIds.Contains(s.PropertyRecordId)))
            .Select(client => new ClientToken(client.Id, client.Sequence))
            .FirstOrDefaultAsync(cancellationToken);

    }

    public async Task<ClientToken?> TryAdd(Client client, UserId userId, CancellationToken cancellationToken)
    {
        var dao = new ClientDao
        {
            Id = client.Token.Id, 
            Name = client.Name,
            EmailId = client.EmailId,
            PhoneNo = client.PhoneNo,
            AccountId = userId.Value, 
            Sequence = client.Token.Sequence,
            SellRecords = client.SellRecords?.Select(x => new PropertyRecordDao
            {
                PropertyRecordId = x.Id,
                Rate = x.Rate,
                PaymentPlan = x.PaymentPlan
            }).ToList()
        };

        // 2. Add to context
        _context.Clients.Add(dao);

        // 3. Save to DB
        await _context.SaveChangesAsync(cancellationToken);

        // 4. Return the composite token
        return new ClientToken(dao.Id, dao.Sequence);
    }
}