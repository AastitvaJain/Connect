namespace Connect.Configs.Inventories.New.UnitNo.Get;

public static class Route
{
    public static void MapGetNewUnitNo(this IEndpoints endpoints)
    {
        endpoints.MapGet("/configs/new-unit-no", (
                    HttpContext context,
                    IController controller) =>
                controller.Handle(context))
            .WithName("GetNewUnitNo")
            .Produces<NewUnitNoDto>()
            .Produces(Status500InternalServerError)
            .WithTags("Config")
            .RequireAuthorization("User");
    }
}