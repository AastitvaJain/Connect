using Connect.Inventories.Sold.Get;
using Connect.Inventories.New.Get;

namespace Connect.Inventories;

public static class Module
{
    public static void MapInventoriesEndpoints(this IEndpoints endpoints)
    {
        endpoints.MapGetNewInventory();
        endpoints.MapGetSoldInventory();
    }
    
    public static void ConfigureInventoriesModule(this IServices services)
    {
        services.ConfigureGetNewInventories();
        services.ConfigureGetSoldInventories();
    }
}