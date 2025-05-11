namespace Connect;

public sealed record ApprovalCostSheet(
    Guid PropertyId,
    List<ApprovalCostSheetItem> Items);