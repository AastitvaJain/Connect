using Connect.ClientTokens.Create;

namespace Connect.ClientTokens;

public static class Module
{
    public static void MapClientTokenEndpoints(this IEndpoints endpoints)
    {
        endpoints.MapCreateClientToken();
    }
    
    public static void ConfigureClientTokenModule(this IServices services)
    {
        services.ConfigureCreateClientToken();
    }
}