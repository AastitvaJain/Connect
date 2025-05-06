namespace Connect;

public sealed record NewInventory(
    Guid Id,
    string ProjectName,
    string ProjectType,
    string UnitNo,
    float BuiltUpArea,
    float Rate,
    float TotalConsideration,
    float? RevisedRate,
    float? RevisedTotalConsideration);