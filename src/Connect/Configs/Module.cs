using Connect.Configs.ChannelPartners.Get;
using Connect.Configs.Inventories.New.ProjectName.Get;
using Connect.Configs.Inventories.New.UnitNo.Get;
using Connect.Configs.Inventories.Sold.ProjectName.Get;
using Connect.Configs.Inventories.Sold.UnitNo.Get;

namespace Connect.Configs;

public static class Module
{
    public static void MapConfigsEndpoints(this IEndpoints endpoints)
    {
        endpoints.MapGetChannelPartner();
        endpoints.MapGetNewProjectNames();
        endpoints.MapGetSoldProjectNames();
        
        endpoints.MapGetNewUnitNo();
        endpoints.MapGetSoldUnitNo();
    }

    public static void ConfigureConfigsModule(this IServices services)
    {
        services.ConfigureGetChannelPartners();
        services.ConfigureNewProjectNames();       
        services.ConfigureSoldProjectNames();
        
        services.ConfigureNewUnitNos();
        services.ConfigureSoldUnitNos();
    }
}