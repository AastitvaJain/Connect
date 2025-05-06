namespace Connect.Configs.Inventories.Sold.ProjectName.Get;

public static class Route
{
    public static void MapGetSoldProjectNames(this IEndpoints endpoints)
    {
        endpoints.MapGet("/configs/sold-project-names", (
                    HttpContext context,
                    IController controller) =>
                controller.Handle(context))
            .WithName("GetSoldProjectNames")
            .Produces<SoldProjectNameDto>()
            .Produces(Status500InternalServerError)
            .WithTags("Config")
            .RequireAuthorization("User");
    }
}