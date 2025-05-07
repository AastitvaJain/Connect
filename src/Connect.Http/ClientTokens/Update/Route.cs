namespace Connect.ClientTokens.Update;

public static class Route
{
    public static void MapUpdateClientToken(this IEndpoints endpoints)
    {
        endpoints.MapPut("/client-token/{token}",(
                HttpContext context,
                int? token,
                Request? request,
                IController controller) => controller.Handle(context, token, context.GetId(), request))
            .WithName("UpdateClientToken")
            .Produces(Status400BadRequest)
            .Produces(Status404NotFound)
            .Produces(Status500InternalServerError)
            .WithTags("Client Flow")
            .RequireAuthorization("User");
    }
}