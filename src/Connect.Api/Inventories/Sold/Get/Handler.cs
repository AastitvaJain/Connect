namespace Connect.Inventories.Sold.Get;

public interface IHandler
{
    Task<IResult> Handle(Command command, CancellationToken cancellationToken);
}

internal sealed class Handler(IStore store) : IHandler
{
    public async Task<IResult> Handle(Command command, CancellationToken cancellationToken)
    {
        (int pageNo, int pageSize, string? projectNameFilter, 
            string? unitNoFilter, string? buyerNameFilter) = command;
        
        PagedResult<SoldInventory>? result = 
            await store.GetList(pageNo, pageSize, projectNameFilter, unitNoFilter, buyerNameFilter, cancellationToken);

        if (result is null)
            return new NotFoundResult();
        
        return new GetResult(new PagedResult<SoldInventoryDto>()
        {
            TotalCount = result.TotalCount,
            PageNumber = result.PageNumber,
            PageSize = result.PageSize,
            Items = result.Items.Select(SoldInventoryDto.ToDto)
        });
    }
}