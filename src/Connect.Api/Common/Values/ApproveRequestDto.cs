namespace Connect;

public sealed record ApproveRequestDto(
    long Id,
    RequestStatus Status,
    List<ApprovalPropertyRecord>? SellPropertyChanges,
    List<ApprovalPropertyRecord> BuyPropertyChanges,
    List<ApprovalCostSheet> CostSheets,
    bool IsApplied);