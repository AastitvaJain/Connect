namespace Connect.ClientTokens;

public sealed record ClientDto(
    string Token,
    string Name,
    string? Email,
    string? PhoneNumber,
    List<PropertyRecord>? SellRecords,
    List<PropertyRecord>? BuyRecords,
    List<SoldInventoryDto>? SoldInventories,
    List<NewInventoryDto>? NewInventories,
    ClientPayment? Payment)
{
    public static ClientDto ToDto(Client client, List<SoldInventoryDto> soldInventories, List<NewInventoryDto> newInventories)
    {
        return new ClientDto(
            client.Token.GetToken(),
            client.Name.Value,
            client.EmailId?.Value,
            client.PhoneNo,
            client.SellRecords,
            client.BuyRecords,
            soldInventories,
            newInventories,
            client.Payment);
    }
}