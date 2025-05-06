using Connect.Configs.ChannelPartners.Get;
using Connect.Configs.Inventories.Sold.ProjectName.Get;

namespace Connect.Configs;

public static class Module
{
    public static void MapConfigsEndpoints(this IEndpoints endpoints)
    {
        endpoints.MapGetChannelPartner();
        endpoints.MapGetSoldProjectNames();
    }

    public static void ConfigureConfigsModule(this IServices services)
    {
        services.ConfigureGetChannelPartners();
        services.ConfigureSoldProjectNames();
    }
}