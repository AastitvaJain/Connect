namespace Connect;

public sealed record PropertyRecord(
    Guid Id,
    float OriginalRate,
    float? DraftRate,
    float? RequestedRate,
    float? ApprovedRate,
    string? PaymentPlan);