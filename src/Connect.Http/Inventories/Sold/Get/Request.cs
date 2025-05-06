namespace Connect.Inventories.Sold.Get;

public sealed record Request(
    int? Page,
    int? PageSize,
    string? ProjectNameFilter, 
    string? UnitNoFilter,
    string? BuyerNameFilter);