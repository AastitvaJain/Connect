namespace Connect;

public sealed record ApproveRequest(
    RequestStatus Status,
    List<ApprovalPropertyRecord>? SellPropertyChanges,
    List<ApprovalPropertyRecord> BuyPropertyChanges,
    List<ApprovalCostSheet> CostSheets,
    bool IsApplied,
    long? Id = null);