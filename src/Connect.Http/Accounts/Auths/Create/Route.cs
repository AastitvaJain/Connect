namespace Connect.Accounts.Auths.Create;

public static class Route
{
    public static void MapCreateAuths(this IEndpoints endpoints)
    {
        endpoints.MapPost("/auths", (
                    HttpContext context,
                    Request? request,
                    IController controller) =>
                controller.Handle(context, request))
            .WithName("CreateAuth")
            .Produces<AuthDto>()
            .Produces(Status400BadRequest)
            .Produces(Status404NotFound)
            .Produces(Status410Gone)
            .Produces(Status423Locked)
            .WithTags("Login Flow")
            .AllowAnonymous();
    }
}