namespace Connect.Inventories.New.Get;

public sealed record Command(
    int Page,
    int PageSize,
    string? ProjectNameFilter = null, 
    string? UnitNoFilter = null);