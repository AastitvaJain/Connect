using Connect.Requests.Create;

namespace Connect.Requests;

public static class Module
{
    public static void MapRequestsEndpoints(this IEndpoints endpoints)
    {
        endpoints.MapCreateRequests();
    }

    public static void ConfigureRequestsModule(this IServices services)
    {
        services.ConfigureCreateRequests();
    }
}