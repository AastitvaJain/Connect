namespace Connect;

public sealed record ApprovalPropertyRecord(
    Guid PropertyId,
    float OriginalRate,
    float? ProposedRate);