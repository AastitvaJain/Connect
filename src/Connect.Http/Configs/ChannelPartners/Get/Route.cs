namespace Connect.Configs.ChannelPartners.Get;

public static class Route
{
    public static void MapGetChannelPartner(this IEndpoints endpoints)
    {
        endpoints.MapGet("/configs/cp", (
                    HttpContext context,
                    IController controller) =>
                controller.Handle(context))
            .WithName("GetChannelPartner")
            .Produces<ChannelPartnerDto>()
            .Produces(Status500InternalServerError)
            .WithTags("Config")
            .RequireAuthorization("User");
    }
}