namespace Connect.Leads.Create;

internal sealed class Store(ConnectDbContext context) : IStore
{
    public async Task<bool> CheckSellRecords(List<PropertyRecord> sellRecords, CancellationToken cancellationToken)
    {
        var recordIds = sellRecords.Select(x => x.Id).ToList();

        var matchedCount = await context.ReadOnlySet<SoldInventoryDao>()
            .CountAsync(x => recordIds.Contains(x.Id), cancellationToken);

        return matchedCount == recordIds.Count;
    }

    public async Task<bool> CheckLead(NewLead newLead, CancellationToken cancellationToken)
    {
        var newPropertyIds = newLead.SellRecords
            .Select(r => r.Id)
            .OrderBy(id => id)
            .ToList();

        var matchingLeads = await context.ReadOnlySet<NewLeadDao>()
            .Where(x => x.InterestedProject == newLead.InterestedProject 
                && x.Name == newLead.Name.Value )
            .Include(x => x.SellRecords)
            .ToListAsync(cancellationToken);

        return matchingLeads.Any(existing =>
            existing.SellRecords != null &&
            existing.SellRecords.Count == newPropertyIds.Count &&
            existing.SellRecords
                .Select(r => r.PropertyRecordId)
                .OrderBy(id => id)
                .SequenceEqual(newPropertyIds));
    }


    public async Task<bool> TryAdd(NewLead newLead, UserId userId, DateTime time, CancellationToken cancellationToken)
    {
        NewLeadDao dao = new NewLeadDao
        {
            Name = newLead.Name.Value,
            SellRecords = newLead.SellRecords.Select(r => new PropertyRecordDao
            {
                PropertyRecordId = r.Id,
                OriginalRate = r.OriginalRate,
            }).ToList(),
            LeadStatus = newLead.LeadStatus,
            InterestedProject = newLead.InterestedProject,
            CreatedBy = userId.Value,
            CreatedAt = time
        };

        context.NewLeads.Add(dao);

        try
        {
            await context.SaveChangesAsync(cancellationToken);
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return false;
        }
    }
}