namespace Connect.Requests.Create;

public interface IHandler
{
    Task<IResult> Handle(Command command, CancellationToken cancellationToken);
}

internal sealed class Handler(IStore store) : IHandler
{
    public async Task<IResult> Handle(Command command, CancellationToken cancellationToken)
    {
        (UserId userId, ClientToken clientToken, ApproveRequest request, DateTime currentTime) = command;

        if (!await store.TokenExists(clientToken, cancellationToken))
        {
            return new NotFoundResult();
        }

        if (await store.RequestExists(clientToken, cancellationToken))
        {
            return new AlreadyCreatedResult();
        }
        
        long? requestNumber = await store.TryCreate(request, clientToken, userId, currentTime, cancellationToken);
        
        return requestNumber is not null
            ? new CreatedResult(requestNumber.Value)
            : new CouldNotCreateResult();
    }
}