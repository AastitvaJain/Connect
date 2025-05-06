using Connect.Configs.ChannelPartners.Get;

namespace Connect.Configs;

public static class Module
{
    public static void MapConfigsEndpoints(this IEndpoints endpoints)
    {
        endpoints.MapGetChannelPartner();
    }

    public static void ConfigureConfigsModule(this IServices services)
    {
        services.ConfigureGetChannelPartners();
    }
}