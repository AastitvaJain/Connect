namespace Connect;

public sealed record Client(
    ClientToken Token,
    Name Name,
    EmailId? EmailId,
    string? PhoneNo,
    List<PropertyRecord>? SellRecords,
    List<PropertyRecord>? BuyRecords,
    ClientPayment? Payment,
    bool IsSubmitted)
{
    public static Client Create(
        ClientToken token,
        Name name,
        EmailId? emailId,
        string? phoneNo,
        List<PropertyRecord>? sellRecords)
    {
        return new Client(token, name, emailId, phoneNo, sellRecords, null, null, false);
    }
}