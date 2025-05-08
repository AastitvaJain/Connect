namespace Connect.Inventories.Sold.Get;

public static class Route
{
    public static void MapGetSoldInventory(this IEndpoints endpoints)
    {
        endpoints.MapPost("/get/sold-inventory", (
            HttpContext context,
            Request? request,
            IController controller) => controller.Handle(context, request))
            .WithName("GetSoldInventory")
            .Produces<PagedResult<SoldInventoryDto>>()
            .Produces(Status404NotFound)
            .WithTags("Inventory")
            .RequireAuthorization("User");
    }
}