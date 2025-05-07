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
        
        return new GetResult(ClientDto.ToDto(client));
    }
}