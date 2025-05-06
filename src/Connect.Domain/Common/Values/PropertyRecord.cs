namespace Connect;

public sealed record PropertyRecord(
    Guid Id,
    float? Rate = null,
    string? PaymentPlan = null);