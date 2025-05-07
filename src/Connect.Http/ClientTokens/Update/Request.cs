namespace Connect.ClientTokens.Update;

public sealed record Request(
    string? Name = null,
    string? Email = null,
    string? PhoneNumber = null,
    List<PropertyRecord>? SellRecords = null,
    List<PropertyRecord>? BuyRecords = null,
    ClientPayment? Payment = null);