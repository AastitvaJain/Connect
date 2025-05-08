namespace Connect.Inventories.Sold.Get;

public interface IStore
{
    Task<PagedResult<SoldInventory>?> GetList(
        int pageNo,
        int pageSize,
        string? projectNameFilter,
        string? unitNoFilter,
        string? buyerNameFilter,
        CancellationToken cancellationToken);
}