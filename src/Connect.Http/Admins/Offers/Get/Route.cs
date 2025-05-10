namespace Connect.Admins.Offers.Get;

public static class Route
{
    public static void MapGetOffers(this IEndpoints endpoints)
    {
        endpoints.MapGet("/admin/offers", (
                    HttpContext context,
                    IController controller) =>
                controller.Handle(context))
            .WithName("GetProjectOffers")
            .Produces<ProjectOffer>()
            .Produces(Status500InternalServerError)
            .WithTags("Admin")
            .RequireAuthorization("Admin");
    }
}