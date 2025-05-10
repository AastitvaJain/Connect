namespace Connect.Admins.Offers.Update;

public interface IResult { }

public sealed record UpdatedResult(IEnumerable<ProjectOffer> ProjectOffers) : IResult;

public sealed record NotFoundResult() : IResult;

public sealed record CouldNotUpdateResult : IResult;