namespace Connect.Leads.Create;

public interface IResult { }

public sealed record CreatedResult : IResult;

public sealed record CouldNotCreateResult : IResult;

public sealed record AlreadyCreatedResult : IResult;

public sealed record NotFoundResult : IResult;