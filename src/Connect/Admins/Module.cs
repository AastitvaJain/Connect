using Connect.Admins.Offers.Get;
using Connect.Admins.Offers.Update;

namespace Connect.Admins;

public static class Module
{
    public static void MapAdminEndpoints(this IEndpoints endpoints)
    {
        endpoints.MapGetOffers();
        endpoints.MapUpdateOffers();
    }

    public static void ConfigureAdminModule(this IServices services)
    {
        services.ConfigureGetOffers();
        services.ConfigureUpdateOffers();
    }
}