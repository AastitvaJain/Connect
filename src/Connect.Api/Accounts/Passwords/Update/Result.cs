namespace Connect.Accounts.Passwords.Update;

public interface IResult { }

public sealed record UpdatedResult : IResult;

public sealed record PasswordMismatchResult : IResult;

public sealed record LockedResult : IResult;

public sealed record NotFoundResult : IResult;