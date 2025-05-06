namespace Connect.Accounts.Logouts.Create;

public static class Route
{
    public static void MapCreateLogouts(this IEndpoints endpoints)
    {
        endpoints.MapPost("/logouts", (
                    HttpContext context,
                    IController controller) =>
                controller.Handle(context, context.GetId()))
            .WithName("CreateLogout")
            .Produces(Status202Accepted)
            .Produces(Status404NotFound)
            .WithTags("Login Flow")
            .RequireAuthorization("User");
    }
}