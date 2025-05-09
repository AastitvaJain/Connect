namespace Connect.ClientTokens.Update;

public interface IHandler
{
    Task<IResult> Handle(Command command, CancellationToken cancellationToken);
}

internal sealed class Handler(IStore store) : IHandler
{
    public async Task<IResult> Handle(Command command, CancellationToken cancellationToken)
    {
        (UserId userId, ClientToken token,  DateTime currentTime, Name? name,
            EmailId? email, string? phoneNumber, List<PropertyRecord>? sellRecords
            , List<PropertyRecord>? buyRecords, ClientPayment? payment) = command;

        Client? client = await store.Get(token, cancellationToken);
        
        if (client is null)
        {
            return new NotFoundResult();
        }
        
        if (sellRecords is not null && !await store.CheckSellRecords(sellRecords, cancellationToken))
        {
            return new NotFoundResult();
        }

        if (buyRecords is not null && !await store.CheckBuyRecords(buyRecords, cancellationToken))
        {
            return new NotFoundResult();
        }

        Client updatedClient = new(
            token,
            name ?? client.Name,
            email,
            phoneNumber,
            sellRecords,
            buyRecords,
            payment);

        if (!await store.TryUpdate(updatedClient, userId, currentTime, cancellationToken)) 
            return new CouldNotUpdateResult();
        
        List<SoldInventory> soldInventories = await store.GetSoldInventories(token, cancellationToken) ?? [];
        List<NewInventory> newInventories = await store.GetNewInventories(token, cancellationToken) ?? [];

        return new UpdatedResult(ClientDto.ToDto(updatedClient,
            soldInventories.Select(SoldInventoryDto.ToDto).ToList(),
            newInventories.Select(NewInventoryDto.ToDto).ToList()));

    }
}