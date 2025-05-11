namespace Connect.ClientTokens.Update;

public sealed record Command(
    UserId UserId,
    ClientToken Token,
    DateTime CurrentTime,
    Name? Name,
    EmailId? Email,
    string? PhoneNumber,
    List<PropertyRecord>? SellRecords,
    List<PropertyRecord>? BuyRecords,
    ClientPayment? Payment,
    bool IsSubmitted);