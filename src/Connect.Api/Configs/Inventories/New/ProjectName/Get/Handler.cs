namespace Connect.Configs.Inventories.New.ProjectName.Get;

public interface IHandler
{
    Task<IResult> Handle();
}

internal sealed class Handler(IStore store) : IHandler
{
    public async Task<IResult> Handle()
    {
        IEnumerable<string>? newProjectNames = await store.GetList();

        if (newProjectNames is null)
            return new CouldNotGetResult();

        return new GetResult(newProjectNames.Select(ToDto));
    }

    private NewProjectNameDto ToDto(string newProjectName)
    {
        return new(newProjectName);
    }
}