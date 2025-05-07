namespace Connect.ClientTokens.Get;

public static class Route
{
    public static void MapGetClientToken(this IEndpoints endpoints)
    {
        endpoints.MapGet("/client-token/{token}",(
            HttpContext context,
            int? token,
            IController controller) => controller.Handle(context, token))
            .WithName("GetClientToken")
            .Produces<ClientDto>()
            .Produces(Status400BadRequest)
            .Produces(Status404NotFound)
            .WithTags("Client Flow")
            .RequireAuthorization("User");
    }
}