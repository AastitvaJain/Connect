namespace Connect.Accounts.Signups.Emails.Create;

public static class Route
{
    public static void MapCreateEmailSignups(this IEndpoints endpoints)
    {
        endpoints.MapPost("/email-signups", (
            HttpContext context,
            Request request,
            IController controller) => controller.Handle(context, request))
            .WithName("CreateEmailSignups")
            .Produces<AuthUserDto>()
            .Produces(Status400BadRequest)
            .Produces(Status409Conflict)
            .Produces(Status500InternalServerError)
            .WithTags("Login Flow")
            .AllowAnonymous(); 
    }
}