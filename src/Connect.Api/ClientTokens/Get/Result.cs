namespace Connect.ClientTokens.Get;

public interface IResult { }

public sealed record GetResult(ClientDto ClientData) : IResult;
public sealed record NotFoundResult : IResult;