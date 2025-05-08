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
        
        PagedResult<NewInventory>? result = 
            await store.GetList(pageNo, pageSize, projectNameFilter, unitNoFilter, cancellationToken);

        if (result is null)
            return new NotFoundResult();
        
        return new GetResult(new PagedResult<NewInventoryDto>()
        {
            TotalCount = result.TotalCount,
            PageNumber = result.PageNumber,
            PageSize = result.PageSize,
            Items = result.Items.Select(NewInventoryDto.ToDto)
        });
    }
}