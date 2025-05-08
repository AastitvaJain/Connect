namespace Connect.Inventories.Sold.Get;

public interface IResult { }

public sealed record GetResult(PagedResult<SoldInventoryDto> SoldInventories) : IResult;

public sealed record NotFoundResult : IResult;