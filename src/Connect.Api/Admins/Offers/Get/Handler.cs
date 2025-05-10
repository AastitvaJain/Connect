namespace Connect.Admins.Offers.Get;

public interface IHandler
{
    Task<IResult> Handle(CancellationToken cancellationToken);
}

internal sealed class Handler(IStore store) : IHandler
{
    public async Task<IResult> Handle(CancellationToken cancellationToken)
    {
        IEnumerable<ProjectOffer>? offers = await store.GetList(cancellationToken);

        if (offers is null)
        {
            return new CouldNotGetResult();
        }

        return new GetResult(offers);
    }
}