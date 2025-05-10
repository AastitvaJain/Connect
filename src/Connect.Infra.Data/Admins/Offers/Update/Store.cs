namespace Connect.Admins.Offers.Update;

internal sealed class Store(ConnectDbContext context) : IStore
{
    public async Task<bool> CheckList(List<ProjectOffer> list, CancellationToken cancellationToken)
    {
        List<string> recordIds = list.Select(x => x.Id).ToList();

        int matchedCount = await context.ReadOnlySet<ProjectOfferDao>()
            .CountAsync(x => recordIds.Contains(x.Id), cancellationToken);

        return matchedCount == recordIds.Count;
    }

    public async Task<List<ProjectOffer>?> TryUpdate(List<ProjectOffer> list, UserId userId, DateTime time, CancellationToken cancellationToken)
    {
        var idsToUpdate = list.Select(x => x.Id).ToList();

        var existingRecords = await context.Set<ProjectOfferDao>()
            .Where(x => idsToUpdate.Contains(x.Id))
            .ToListAsync(cancellationToken);

        foreach (var record in existingRecords)
        {
            var update = list.First(x => x.Id == record.Id);

            record.OfferAmount = update.OfferAmount;
            record.UpdatedBy = userId.Value;
            record.UpdatedAt = time;
        }

        try
        {
            await context.SaveChangesAsync(cancellationToken);
        }
        catch (Exception e)
        {
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