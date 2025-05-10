namespace Connect.Admins.Offers.Update;

public sealed record Command(
    UserId UserId,
    List<ProjectOffer> Offers,
    DateTime CurrentTime);