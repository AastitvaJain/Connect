namespace Connect.Accounts.Passwords.Update;

public static class Route
{
    public static void MapUpdatePasswords(this IEndpoints endpoints)
    {
        endpoints.MapPost("/update-passwords", (
                    HttpContext context,
                    Request? request,
                    IController controller) =>
                controller.Handle(context, context.GetId(), request))
            .WithName("CreatePassword")
            .Produces(Status204NoContent)
            .Produces(Status409Conflict)
            .Produces(Status404NotFound)
            .Produces(Status400BadRequest)
            .Produces(Status423Locked)
            .WithTags("Login Flow")
            .RequireAuthorization("User");
    }
}