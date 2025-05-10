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
            foreach (ProjectOffer offer in list)
            {
                var record = existingRecords.FirstOrDefault(x => string.Equals(x.Id, offer.Id));

                if (record is null)
                    return [];
                
                if (Math.Abs((record.OfferAmount ?? 0) - offer.OfferAmount) < Tolerance)
                    continue;
            
                record.OfferAmount = offer.OfferAmount;
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