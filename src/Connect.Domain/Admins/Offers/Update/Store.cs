namespace Connect.Admins.Offers.Update;

public interface IStore
{
    Task<bool> CheckList(List<ProjectOffer> list, CancellationToken cancellationToken);

    Task<List<ProjectOffer>?> TryUpdate(List<ProjectOffer> list, UserId userId, DateTime time, CancellationToken cancellationToken);
}