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
        
        return new GetResult(newInventories.Select(ToDto));
    }

    private NewInventoryDto ToDto(NewInventory newInventory)
    {
        return new NewInventoryDto(
            newInventory.Id,
            newInventory.ProjectName,
            newInventory.ProjectType,
            newInventory.UnitNo,
            newInventory.BuiltUpArea,
            (float)(newInventory.RevisedRate is null or 0 ? newInventory.Rate : newInventory.RevisedRate),
            (float)(newInventory.RevisedTotalConsideration is null or 0
                ? newInventory.TotalConsideration
                : newInventory.RevisedTotalConsideration));
    }
}