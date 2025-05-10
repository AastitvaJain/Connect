namespace Connect;

public sealed record SoldInventoryDto(
    Guid Id,
    string ProjectName,
    string ProjectType,
    string UnitNo,
    string? UnitCategory,
    string BuyerName,
    float BuiltUpArea,
    float Rate,
    float TotalConsideration,
    float NetReceived,
    float AssuredPrice,
    float? Discount)
{
    public static SoldInventoryDto ToDto(SoldInventory soldInventory)
    {
        return new SoldInventoryDto(
            soldInventory.Id,
            soldInventory.ProjectName,
            soldInventory.ProjectType,
            soldInventory.UnitNo,
            soldInventory.UnitCategory,
            soldInventory.BuyerName,
            soldInventory.BuiltUpArea,
            soldInventory.Rate,
            soldInventory.TotalConsideration,
            soldInventory.NetReceived,
            soldInventory.AssuredPrice,
            soldInventory.Discount);
    }
}