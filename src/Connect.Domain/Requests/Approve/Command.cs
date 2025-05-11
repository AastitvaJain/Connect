namespace Connect.Requests.Approve;

public sealed record Command(
    UserId UserId,
    long RequestId,
    ApproveRequest ApproveRequest,
    DateTime CurrentTime);