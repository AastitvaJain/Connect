namespace Connect.Configs.Inventories.Sold.ProjectName.Get;

public interface IHandler
{
    Task<IResult> Handle();
}

internal sealed class Handler(IStore store) : IHandler
{
    public async Task<IResult> Handle()
    {
        IEnumerable<string>? soldProjectNames = await store.GetList();

        if (soldProjectNames is null)
            return new CouldNotGetResult();

        return new GetResult(soldProjectNames.Select(ToDto));
    }

    private SoldProjectNameDto ToDto(string soldProjectName)
    {
        return new(soldProjectName);
    }
}