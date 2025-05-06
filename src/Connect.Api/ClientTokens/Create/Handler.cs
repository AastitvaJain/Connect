namespace Connect.ClientTokens.Create;

public interface IHandler
{
    Task<IResult> Handle(Command command, CancellationToken cancellationToken);
}

internal sealed class Handler(IStore store) : IHandler
{
    public async Task<IResult> Handle(Command command, CancellationToken cancellationToken)
    {
        (UserId userId, Name name, DateTime currentTime,
            EmailId? email, string? phoneNumber, List<PropertyRecord>? sellRecords) = command;

        if (sellRecords is not null && sellRecords.Count > 0)
        {
            if (!await store.CheckSellRecords(sellRecords, cancellationToken))
            {
                return new NotFoundResult();
            }
            
            ClientToken? token = await store.AlreadyCreated(sellRecords, cancellationToken);

            if (token is not null)
                return new AlreadyCreatedResult(token.GetToken());
        }
        
        Client client = new(ClientToken.Create(currentTime), name, email, phoneNumber, sellRecords);
        
        ClientToken? clientToken = await store.TryAdd(client, userId, cancellationToken);
            
        return clientToken is not null
        ? new CreatedResult(clientToken.GetToken())
        : new CouldNotCreateResult();
    }
}