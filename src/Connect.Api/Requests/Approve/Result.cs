namespace Connect.Requests.Approve;

public interface IResult { }

public sealed record ApprovedResult : IResult;

public sealed record CouldNotApproveResult : IResult;

public sealed record NotFoundResult : IResult;