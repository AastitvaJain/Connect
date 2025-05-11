namespace Connect;

public sealed record ApprovalCostSheetItem(
    string Particular,
    float? PaymentPercentage,
    float? TotalPaymentWithoutTax,
    float? FtAdjustment,
    float? DiscountAdjustment,
    float? NetPayableByCustomer,
    float? GstPayable,
    int Sequence);