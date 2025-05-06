using Connect.Inventories.Sold.Get;

namespace Connect.Inventories;

public static class Module
{
    public static void MapInventoriesEndpoints(this IEndpoints endpoints)
    {
        endpoints.MapGetSoldInventory();
    }
    
    public static void ConfigureInventoriesModule(this IServices services)
    {
        services.ConfigureGetSoldInventories();
    }
}