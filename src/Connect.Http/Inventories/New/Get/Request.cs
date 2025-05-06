namespace Connect.Inventories.New.Get;

public sealed record Request(
    int? Page,
    int? PageSize,
    string? ProjectNameFilter, 
    string? UnitNoFilter);