namespace Connect.Admins.Offers.Get;

public interface IResult { }

public sealed record GetResult(IEnumerable<ProjectOffer> ProjectOffers) : IResult;

public sealed record CouldNotGetResult : IResult;