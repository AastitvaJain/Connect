namespace Connect.Requests.Create;

public static class Route
{
    public static void MapCreateRequests(this IEndpoints endpoints)
    {
        endpoints.MapPost("/create-request/{token}", (
                HttpContext context,
                int? token,
                Request? request,
                IController controller) => controller.Handle(context, context.GetId(), token, request))
            .WithName("CreateRequest")
            .Produces(Status400BadRequest)
            .Produces(Status404NotFound)
            .Produces(Status500InternalServerError)
            .WithTags("Approval Flow")
            .RequireAuthorization("User");
    }
}