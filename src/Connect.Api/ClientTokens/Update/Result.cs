namespace Connect.ClientTokens.Update;

public interface IResult { }

public sealed record UpdatedResult(ClientDto ClientData) : IResult;

public sealed record CouldNotUpdateResult : IResult;

public sealed record NotFoundResult : IResult;

public sealed record AlreadySubmittedResult : IResult;