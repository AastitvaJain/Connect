namespace Connect.ClientTokens;

public sealed record ClientDto(
    string Token,
    string Name,
    string? Email,
    string? PhoneNumber,
    List<PropertyRecord>? SellRecords,
    List<PropertyRecord>? BuyRecords,
    ClientPayment? Payment)
{
    public static ClientDto ToDto(Client client)
    {
        return new ClientDto(
            client.Token.GetToken(),
            client.Name.Value,
            client.EmailId?.Value,
            client.PhoneNo,
            client.SellRecords,
            client.BuyRecords,
            client.Payment);
    }
}