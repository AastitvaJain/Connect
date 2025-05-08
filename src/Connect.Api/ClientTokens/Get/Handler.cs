namespace Connect.ClientTokens.Get;

public interface IHandler
{
    Task<IResult> Handle(ClientToken token, CancellationToken cancellationToken);
}

public class Handler(IStore store) : IHandler
{
    public async Task<IResult> Handle(ClientToken token, CancellationToken cancellationToken)
    {
        Client? client = await store.Get(token, cancellationToken);
        
        if (client is null)
        {
            return new NotFoundResult();
        }
        
        List<SoldInventory> soldInventories = await store.GetSoldInventories(token, cancellationToken) ?? new();
        List<NewInventory> newInventories = await store.GetNewInventories(token, cancellationToken) ?? new();


        return new GetResult(
            ClientDto.ToDto(
                client, 
                soldInventories.Select(SoldInventoryDto.ToDto).ToList(),
                newInventories.Select(NewInventoryDto.ToDto).ToList())
            );
    }
}