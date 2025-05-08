namespace Connect.Inventories.New.Get;

public static class Route
{
    public static void MapGetNewInventory(this IEndpoints endpoints)
    {
        endpoints.MapPost("/get/new-inventory", (
                HttpContext context,
                Request? request,
                IController controller) => controller.Handle(context, request))
            .WithName("GetNewInventory")
            .Produces<PagedResult<SoldInventoryDto>>()
            .Produces(Status404NotFound)
            .WithTags("Inventory")
            .RequireAuthorization("User");
    }
}