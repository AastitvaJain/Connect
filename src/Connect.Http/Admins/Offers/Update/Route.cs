namespace Connect.Admins.Offers.Update;

public static class Route
{
    public static void MapUpdateOffers(this IEndpoints endpoints)
    {
        endpoints.MapPut("/admin/offers",(
                HttpContext context,
                Request? request,
                IController controller) => controller.Handle(context, context.GetId(), request))
            .WithName("UpdateOffers")
            .Produces(Status400BadRequest)
            .Produces(Status404NotFound)
            .Produces(Status500InternalServerError)
            .WithTags("Admin")
            .RequireAuthorization("Admin");
    }
}