namespace Connect.Accounts.Logins.Emails.Create;

public interface IResult { }

public sealed record CreatedResult(AuthUserDto AuthUser) : IResult;

public sealed record PasswordMismatchResult : IResult;

public sealed record LockedResult : IResult;

public sealed record NotFoundResult : IResult;