namespace Connect;

public sealed record Client(
    ClientToken Token,
    Name Name,
    EmailId? EmailId = null,
    string? PhoneNo = null,
    List<PropertyRecord>? SellRecords = null,
    List<PropertyRecord>? BuyRecords = null,
    ClientPayment? Payment = null);