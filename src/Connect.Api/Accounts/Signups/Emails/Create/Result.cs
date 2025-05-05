namespace Connect.Accounts.Signups.Emails.Create;

public interface IResult { }

public sealed record CreatedResult(AuthUserDto AuthUser) : IResult;

public sealed record EmailConflictResult : IResult;

public sealed record IdCreationErrorResult : IResult;