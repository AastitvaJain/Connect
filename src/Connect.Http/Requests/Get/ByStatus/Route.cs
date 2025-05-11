namespace Connect.Requests.Get.ByStatus;

public static class Route
{
    public static void MapGetRequestsByStatus(this IEndpoints endpoints)
    {
        endpoints.MapGet("/request", (
            HttpContext context,
            IController controller,
            string? status,
            int page = 1,
            int pageSize = 10) => controller.Handle(context, status, page, pageSize))
            .WithName("GetRequestsByStatus")
            .Produces<PagedResult<ApproveRequestDto>>()
            .Produces(Status400BadRequest)
            .Produces(Status500InternalServerError)
            .WithTags("Approval Flow")
            .RequireAuthorization("Admin");
            
    }
}