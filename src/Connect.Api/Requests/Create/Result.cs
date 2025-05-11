namespace Connect.Requests.Create;

public interface IResult { }

public sealed record CreatedResult(long RequestId) : IResult;

public sealed record CouldNotCreateResult : IResult;

public sealed record AlreadyCreatedResult : IResult;

public sealed record NotFoundResult : IResult;