namespace Connect.Admins.Offers.Update;

public sealed record Request(
    List<ProjectOffer>? ProjectOffers);