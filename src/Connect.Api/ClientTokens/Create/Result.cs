namespace Connect.ClientTokens.Create;

public interface IResult { }

public sealed record CreatedResult(string Token) : IResult;

public sealed record CouldNotCreateResult : IResult;

public sealed record AlreadyCreatedResult(string Token) : IResult;

public sealed record NotFoundResult : IResult;