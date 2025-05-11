namespace Connect.Requests.Approve;

public sealed record Request(
    long? RequestId,
    List<ApprovalPropertyRecord>? SellPropertyChanges,
    List<ApprovalPropertyRecord>? BuyPropertyChanges,
    List<ApprovalCostSheet>? CostSheet,
    string? Reason);