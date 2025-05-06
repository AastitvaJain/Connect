namespace Connect.Configs.Inventories.Sold.ProjectName.Get;

public interface IResult { }

public sealed record GetResult(
    IEnumerable<SoldProjectNameDto> SoldProjectNames) : IResult;
    
public sealed record CouldNotGetResult : IResult;