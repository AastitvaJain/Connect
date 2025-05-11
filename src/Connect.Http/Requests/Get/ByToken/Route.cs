namespace Connect.Requests.Get.ByToken;

public static class Route
{
    public static void MapGetRequestsByToken(this IEndpoints endpoints)
    {
        endpoints.MapGet("/request/{token}", (
                HttpContext context,
                int? token,
                IController controller) => controller.Handle(context, token))
            .WithName("GetRequestsByToken")
            .Produces<List<ApproveRequestDto>>()
            .Produces(Status400BadRequest)
            .Produces(Status500InternalServerError)
            .WithTags("Approval Flow")
            .RequireAuthorization("User");
            
    }
}