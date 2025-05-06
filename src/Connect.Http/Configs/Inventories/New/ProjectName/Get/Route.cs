namespace Connect.Configs.Inventories.New.ProjectName.Get;

public static class Route
{
    public static void MapGetNewProjectNames(this IEndpoints endpoints)
    {
        endpoints.MapGet("/configs/new-project-names", (
                    HttpContext context,
                    IController controller) =>
                controller.Handle(context))
            .WithName("GetNewProjectNames")
            .Produces<NewProjectNameDto>()
            .Produces(Status500InternalServerError)
            .WithTags("Config")
            .RequireAuthorization("User");
    }
}