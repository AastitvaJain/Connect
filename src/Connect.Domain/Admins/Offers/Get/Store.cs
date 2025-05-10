namespace Connect.Admins.Offers.Get;

public interface IStore
{
    Task<IEnumerable<ProjectOffer>?> GetList(CancellationToken cancellationToken);
}