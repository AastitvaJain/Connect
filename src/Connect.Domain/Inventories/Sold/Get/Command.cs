namespace Connect.Inventories.Sold.Get;

public sealed record Command(
    int Page,
    int PageSize,
    string? ProjectNameFilter = null, 
    string? UnitNoFilter = null,
    string? BuyerNameFilter = null);