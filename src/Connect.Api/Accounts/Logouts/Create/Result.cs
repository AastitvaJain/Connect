namespace Connect.Accounts.Logouts.Create;

public interface IResult { }

public sealed record LoggedOutResult : IResult;

public sealed record AlreadyLoggedOutResult : IResult;

public sealed record NotFoundResult : IResult;