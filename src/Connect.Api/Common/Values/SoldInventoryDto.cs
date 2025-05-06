namespace Connect;

public sealed record SoldInventoryDto(
    Guid Id,
    string ProjectName,
    string ProjectType,
    string UnitNo,
    string BuyerName,
    float BuiltUpArea,
    float Rate,
    float TotalConsideration,
    float NetReceived);