namespace Connect;

public sealed record NewInventoryDto(
    Guid Id,
    string ProjectName,
    string ProjectType,
    string UnitNo,
    float BuiltUpArea,
    float Rate,
    float TotalConsideration);
