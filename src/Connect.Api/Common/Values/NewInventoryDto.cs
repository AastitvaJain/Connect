namespace Connect;

public sealed record NewInventoryDto(
    Guid Id,
    string ProjectName,
    string ProjectType,
    string UnitNo,
    float BuiltUpArea,
    float Rate,
    float TotalConsideration)
{
    public static NewInventoryDto ToDto(NewInventory newInventory)
    {
        return new NewInventoryDto(
            newInventory.Id,
            newInventory.ProjectName,
            newInventory.ProjectType,
            newInventory.UnitNo,
            newInventory.BuiltUpArea,
            (float)(newInventory.RevisedRate is null or 0 ? newInventory.Rate : newInventory.RevisedRate),
            (float)(newInventory.RevisedTotalConsideration is null or 0
                ? newInventory.TotalConsideration
                : newInventory.RevisedTotalConsideration));
    }
}
