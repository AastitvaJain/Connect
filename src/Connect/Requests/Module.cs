using Connect.Requests.Approve;
using Connect.Requests.Create;
using Connect.Requests.Reject;

namespace Connect.Requests;

public static class Module
{
    public static void MapRequestsEndpoints(this IEndpoints endpoints)
    {
        endpoints.MapCreateRequests();
        endpoints.MapRejectRequests();
        endpoints.MapApproveRequests();
    }

    public static void ConfigureRequestsModule(this IServices services)
    {
        services.ConfigureCreateRequests();
        services.ConfigureRejectRequests();
        services.ConfigureApproveRequests();
    }
}