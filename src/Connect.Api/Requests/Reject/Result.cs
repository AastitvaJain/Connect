namespace Connect.Requests.Reject;

public interface IResult { }

public sealed record RejectedResult : IResult;

public sealed record CouldNotRejectResult : IResult;

public sealed record NotFoundResult : IResult;