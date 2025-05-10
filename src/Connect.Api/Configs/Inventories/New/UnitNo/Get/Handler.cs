namespace Connect.Configs.Inventories.New.UnitNo.Get;

public interface IHandler
{
    Task<IResult> Handle();
}

internal sealed class Handler(IStore store) : IHandler
{
    public async Task<IResult> Handle()
    {
        IEnumerable<string>? newUnitNo = await store.GetList();

        if (newUnitNo is null)
            return new CouldNotGetResult();

        return new GetResult(newUnitNo.Select(ToDto));
    }

    private NewUnitNoDto ToDto(string newUnitNo)
    {
        return new(newUnitNo);
    }
}