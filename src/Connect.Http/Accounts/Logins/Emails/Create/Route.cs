namespace Connect.Accounts.Logins.Emails.Create;

public static class Route
{
    public static void MapCreateEmailLogins(this IEndpoints endpoints)
    {
        endpoints.MapPost("/email-logins", (
                HttpContext context,
                Request request,
                IController controller) => controller.Handle(context, request))
            .WithName("CreateEmailLogins")
            .Produces<AuthUserDto>()
            .Produces(Status400BadRequest)
            .Produces(Status409Conflict)
            .Produces(Status500InternalServerError)
            .WithTags("Login Flow")
            .AllowAnonymous(); 
    }
}