namespace Connect.ClientTokens.Create;

public static class Route
{
    public static void MapCreateClientToken(this IEndpoints endpoints)
    {
        endpoints.MapPost("/client-token",(
            HttpContext context,
            Request? request,
            IController controller) => controller.Handle(context, context.GetId(), request))
            .WithName("CreateClientToken")
            .Produces(Status400BadRequest)
            .Produces(Status404NotFound)
            .Produces(Status500InternalServerError)
            .WithTags("Client Flow")
            .RequireAuthorization("User");
    }
}