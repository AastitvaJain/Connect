namespace Connect.Requests.Create;

public sealed record Command(
    UserId UserId,
    ClientToken Token,
    ApproveRequest ApproveRequest,
    DateTime CurrentTime);