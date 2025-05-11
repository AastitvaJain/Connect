namespace Connect;

public sealed record ApproveRequestDto(
    long Id,
    string Name,
    string? Email,
    string? PhoneNumber,
    RequestStatus Status,
    List<ApprovalPropertyRecord>? SellPropertyChanges,
    List<ApprovalPropertyRecord> BuyPropertyChanges,
    List<SoldInventoryDto>? SoldInventories,
    List<NewInventoryDto> NewInventories,
    List<ApprovalCostSheet> CostSheets,
    bool IsApplied);