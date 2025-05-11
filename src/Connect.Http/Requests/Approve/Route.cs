namespace Connect.Requests.Approve;

public static class Route
{
    public static void MapApproveRequests(this IEndpoints endpoints)
    {
        endpoints.MapPost("/approve-request", (
                HttpContext context,
                Request? request,
                IController controller) => controller.Handle(context, context.GetId(), request))
            .WithName("ApproveRequest")
            .Produces(Status400BadRequest)
            .Produces(Status404NotFound)
            .Produces(Status500InternalServerError)
            .WithTags("Approval Flow")
            .RequireAuthorization("Admin");
    }
}