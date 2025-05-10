namespace Connect.Configs.Inventories.Sold.UnitNo.Get;

public interface IHandler
{
    Task<IResult> Handle();
}

internal sealed class Handler(IStore store) : IHandler
{
    public async Task<IResult> Handle()
    {
        IEnumerable<string>? soldUnitNo = await store.GetList();

        if (soldUnitNo is null)
            return new CouldNotGetResult();

        return new GetResult(soldUnitNo.Select(ToDto));
    }

    private SoldUnitNoDto ToDto(string soldUnitNo)
    {
        return new(soldUnitNo);
    }
}