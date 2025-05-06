namespace Connect;

public sealed record SoldInventory(
    Guid Id,
    string? BookingId,
    DateTime BookingDate,
    string ProjectName,
    string ProjectType,
    string UnitNo,
    string UniqueKey,
    string BuyerName,
    float BuiltUpArea,
    float Rate,
    float TotalConsideration,
    float NetReceived);