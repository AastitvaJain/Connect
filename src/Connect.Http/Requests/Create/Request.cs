namespace Connect.Requests.Create;

public sealed record Request(
    List<ApprovalPropertyRecord>? SellPropertyChanges,
    List<ApprovalPropertyRecord>? BuyPropertyChanges,
    List<ApprovalCostSheet>? CostSheet);