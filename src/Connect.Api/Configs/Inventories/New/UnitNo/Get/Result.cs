namespace Connect.Configs.Inventories.New.UnitNo.Get;

public interface IResult { }

public sealed record GetResult(
    IEnumerable<NewUnitNoDto> NewUnitNos) : IResult;
    
public sealed record CouldNotGetResult : IResult;