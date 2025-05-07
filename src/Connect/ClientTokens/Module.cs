using Connect.ClientTokens.Create;
using Connect.ClientTokens.Get;
using Connect.ClientTokens.Update;

namespace Connect.ClientTokens;

public static class Module
{
    public static void MapClientTokenEndpoints(this IEndpoints endpoints)
    {
        endpoints.MapCreateClientToken();
        endpoints.MapGetClientToken();
        endpoints.MapUpdateClientToken();
    }
    
    public static void ConfigureClientTokenModule(this IServices services)
    {
        services.ConfigureCreateClientToken();
        services.ConfigureGetClientToken();
        services.ConfigureUpdateClientToken();
    }
}