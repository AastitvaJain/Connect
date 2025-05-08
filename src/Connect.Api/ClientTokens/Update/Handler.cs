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

        Client updatedClient = new(
            token,
            name ?? client.Name,
            email ?? client.EmailId,
            phoneNumber ?? client.PhoneNo,
            sellRecords ?? client.SellRecords,
            buyRecords ?? client.BuyRecords,
            payment ?? client.Payment);

        if (!await store.TryUpdate(updatedClient, userId, cancellationToken)) 
            return new CouldNotUpdateResult();
        
        List<SoldInventory> soldInventories = await store.GetSoldInventories(token, cancellationToken) ?? [];
        List<NewInventory> newInventories = await store.GetNewInventories(token, cancellationToken) ?? [];

        return new UpdatedResult(ClientDto.ToDto(updatedClient,
            soldInventories.Select(SoldInventoryDto.ToDto).ToList(),
            newInventories.Select(NewInventoryDto.ToDto).ToList()));

    }
}