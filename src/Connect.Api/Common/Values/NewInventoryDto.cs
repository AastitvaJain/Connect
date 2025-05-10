namespace Connect;

public sealed record NewInventoryDto(
    Guid Id,
    string ProjectName,
    string ProjectType,
    string UnitNo,
    float BuiltUpArea,
    float Rate,
    float TotalConsideration,
    float? BookingAmount,
    float? Premium)
{
    public static NewInventoryDto ToDto(NewInventory newInventory)
    {
        return new NewInventoryDto(
            newInventory.Id,
            newInventory.ProjectName,
            newInventory.ProjectType,
            newInventory.UnitNo,
            newInventory.BuiltUpArea,
            newInventory.Rate,
            newInventory.TotalConsideration,
            newInventory.BookingAmount,
            newInventory.Premium);
    }
}
