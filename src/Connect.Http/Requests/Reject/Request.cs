namespace Connect.Requests.Reject;

public sealed record Request(
    long? RequestId,
    string? Reason);