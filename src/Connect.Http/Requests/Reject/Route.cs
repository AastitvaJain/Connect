namespace Connect.Requests.Reject;

public static class Route
{
    public static void MapRejectRequests(this IEndpoints endpoints)
    {
        endpoints.MapPost("/reject-request", (
            HttpContext context,
            Request? request,
            IController controller) => controller.Handle(context, context.GetId(), request))
            .WithName("RejectRequest")
            .Produces(Status400BadRequest)
            .Produces(Status404NotFound)
            .Produces(Status500InternalServerError)
            .WithTags("Approval Flow")
            .RequireAuthorization("Admin");
    }
}