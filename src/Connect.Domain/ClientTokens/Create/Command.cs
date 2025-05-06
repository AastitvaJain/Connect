namespace Connect.ClientTokens.Create;

public sealed record Command(
    UserId UserId,
    Name Name,
    DateTime CurrentTime,
    EmailId? Email = null,
    string? PhoneNumber = null,
    List<PropertyRecord>? SellRecords = null);