using Connect.Leads.Create;

namespace Connect.Leads;

public static class Module
{
    public static void MapLeadsEndpoints(this IEndpoints endpoints)
    {
        endpoints.MapCreateLeads();
    }
    
    public static void ConfigureLeadsModule(this IServices services)
    {
        services.ConfigureCreateLeads();
    }
}