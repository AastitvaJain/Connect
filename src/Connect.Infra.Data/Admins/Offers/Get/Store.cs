namespace Connect.Admins.Offers.Get;

internal sealed class Store(ConnectDbContext context) : IStore
{
    public async Task<IEnumerable<ProjectOffer>?> GetList(CancellationToken cancellationToken)
    {
        return await context.ReadOnlySet<ProjectOfferDao>()
            .OrderBy(x => x.Id)
            .ThenBy(x => x.ProjectName)
            .Select(x => new ProjectOffer(x.Id, x.ProjectName, x.OfferAmount ?? 0))
            .ToListAsync(cancellationToken);
    }
}