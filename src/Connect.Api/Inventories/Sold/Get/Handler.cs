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
        
        IEnumerable<SoldInventory>? soldInventories = 
            await store.GetList(pageNo, pageSize, projectNameFilter, unitNoFilter, buyerNameFilter, cancellationToken);

        if (soldInventories is null)
            return new NotFoundResult();
        
        return new GetResult(soldInventories.Select(ToDto));
    }

    private SoldInventoryDto ToDto(SoldInventory soldInventory)
    {
        return new SoldInventoryDto(
            soldInventory.Id,
            soldInventory.ProjectName,
            soldInventory.ProjectType,
            soldInventory.UnitNo,
            soldInventory.BuyerName,
            soldInventory.BuiltUpArea,
            soldInventory.Rate,
            soldInventory.TotalConsideration,
            soldInventory.NetReceived,
            soldInventory.RevisedAssuredPrice ?? soldInventory.AssuredPrice);
    }
}