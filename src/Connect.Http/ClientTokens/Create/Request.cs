namespace Connect.ClientTokens.Create;

public sealed record Request(
    string Name,
    string? Email = null,
    string? PhoneNumber = null,
    List<Guid>? SellRecords = null);