namespace Connect.Inventories.New.Get;

public interface IStore
{
    Task<PagedResult<NewInventory>?> GetList(
        int pageNo,
        int pageSize,
        string? projectNameFilter,
        string? unitNoFilter,
        CancellationToken cancellationToken);
}