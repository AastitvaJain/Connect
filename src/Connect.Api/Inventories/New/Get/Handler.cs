namespace Connect.Inventories.New.Get;

public interface IHandler
{
    Task<IResult> Handle(Command command, CancellationToken cancellationToken);
}

internal sealed class Handler(IStore store) : IHandler
{
    public async Task<IResult> Handle(Command command, CancellationToken cancellationToken)
    {
        (int pageNo, int pageSize, string? projectNameFilter, 
            string? unitNoFilter) = command;
        
        IEnumerable<NewInventory>? newInventories = 
            await store.GetList(pageNo, pageSize, projectNameFilter, unitNoFilter, cancellationToken);

        if (newInventories is null)
            return new NotFoundResult();
        
        return new GetResult(newInventories.Select(NewInventoryDto.ToDto));
    }
}