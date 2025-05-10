namespace Connect.Configs.Inventories.Sold.UnitNo.Get;

public static class Route
{
    public static void MapGetSoldUnitNo(this IEndpoints endpoints)
    {
        endpoints.MapGet("/configs/sold-unit-no", (
                    HttpContext context,
                    IController controller) =>
                controller.Handle(context))
            .WithName("GetSoldUnitNo")
            .Produces<SoldUnitNoDto>()
            .Produces(Status500InternalServerError)
            .WithTags("Config")
            .RequireAuthorization("User");
    }
}