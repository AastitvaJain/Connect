namespace Connect.Admins.Offers.Update;

internal sealed class Store(ConnectDbContext context) : IStore
{
    const double Tolerance = 0.00001;
    
    public async Task<bool> CheckList(List<ProjectOffer> list, CancellationToken cancellationToken)
    {
        List<string> recordIds = list.Select(x => x.Id).ToList();

        int matchedCount = await context.ReadOnlySet<ProjectOfferDao>()
            .CountAsync(x => recordIds.Contains(x.Id), cancellationToken);

        return matchedCount == recordIds.Count;
    }

    public async Task<List<ProjectOffer>?> TryUpdate(List<ProjectOffer> list, UserId userId, DateTime time, CancellationToken cancellationToken)
    {
        var existingRecords = await context.ProjectOffer
            .ToListAsync(cancellationToken);

        await using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);

        try
        {
            foreach (var record in existingRecords)
            {
                var update = list.FirstOrDefault(x => x.Id == record.Id);

                if (update is null)
                    return null;
            
                if (Math.Abs((record.OfferAmount ?? 0) - update.OfferAmount) < Tolerance)
                    continue;
            
                record.OfferAmount = update.OfferAmount;
                record.UpdatedBy = userId.Value;
                record.UpdatedAt = time;
            
                if (record.Id.StartsWith("E", StringComparison.OrdinalIgnoreCase))
                {
                    await context.Database.ExecuteSqlInterpolatedAsync(
                        $@"UPDATE sold_inventory 
                       SET discount = {record.OfferAmount} 
                       WHERE property_id = {record.Id}",
                        cancellationToken);
                }
                else if (record.Id.StartsWith("N", StringComparison.OrdinalIgnoreCase))
                {
                    await context.Database.ExecuteSqlInterpolatedAsync(
                        $@"UPDATE new_inventory 
                       SET premium = {record.OfferAmount} 
                       WHERE property_id = {record.Id}",
                        cancellationToken);
                }
            }
            
            await context.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        }
        catch (Exception e)
        {
            await transaction.RollbackAsync(cancellationToken);
            Console.WriteLine(e);
            return null;
        }
        
        return await context.ReadOnlySet<ProjectOfferDao>()
            .OrderBy(x => x.Id)
            .ThenBy(x => x.ProjectName)
            .Select(x => new ProjectOffer(x.Id, x.ProjectName, x.OfferAmount ?? 0))
            .ToListAsync(cancellationToken);
    }
}