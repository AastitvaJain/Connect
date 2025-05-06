namespace Connect.Inventories.New.Get;

public interface IResult { }

public sealed record GetResult(IEnumerable<NewInventoryDto> NewInventories) : IResult;

public sealed record NotFoundResult : IResult;