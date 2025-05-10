namespace Connect.Configs.Inventories.Sold.UnitNo.Get;

public interface IResult { }

public sealed record GetResult(
    IEnumerable<SoldUnitNoDto> SoldUnitNos) : IResult;
    
public sealed record CouldNotGetResult : IResult;