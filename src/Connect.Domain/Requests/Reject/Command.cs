namespace Connect.Requests.Reject;

public sealed record Command(
    UserId UserId,
    long RequestId,
    string Reason,
    DateTime CurrentTime);