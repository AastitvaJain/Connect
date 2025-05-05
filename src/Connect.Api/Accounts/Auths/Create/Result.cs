namespace Connect.Accounts.Auths.Create;

public interface IResult { }

public sealed record CreatedResult(
    AuthDto Auth) : IResult;

public sealed record TokenExpiredResult : IResult;

public sealed record LockedResult : IResult;

public sealed record NotFoundResult : IResult;
