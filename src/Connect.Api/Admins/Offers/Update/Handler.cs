namespace Connect.Admins.Offers.Update;

public interface IHandler
{
    Task<IResult> Handle(Command command,CancellationToken cancellationToken);
}

internal sealed class Handler(IStore store) : IHandler
{
    public async Task<IResult> Handle(Command command, CancellationToken cancellationToken)
    {
        (UserId userId, List<ProjectOffer> offers, DateTime time) = command;

        if (!await store.CheckList(offers, cancellationToken))
        {
            return new NotFoundResult();
        }

        List<ProjectOffer>? updatedOffers = await store.TryUpdate(offers, userId, time, cancellationToken);

        return updatedOffers is not null
            ? updatedOffers.Count > 0 ?
                new UpdatedResult(updatedOffers) 
                : new NotFoundResult()
            : new CouldNotUpdateResult();
    }
}