namespace Connect.Configs.Inventories.New.ProjectName.Get;

public interface IResult { }

public sealed record GetResult(
    IEnumerable<NewProjectNameDto> NewProjectNames) : IResult;
    
public sealed record CouldNotGetResult : IResult;