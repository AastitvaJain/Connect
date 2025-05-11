namespace Connect.Leads.Create;

public static class Route
{
    public static void MapCreateLeads(this IEndpoints endpoints)
    {
        endpoints.MapPost("/create-lead", (
                HttpContext context,
                Request? request,
                IController controller) => controller.Handle(context, context.GetId(), request))
            .WithName("CreateLead")
            .Produces(Status201Created)
            .Produces(Status404NotFound)
            .Produces(Status500InternalServerError)
            .Produces(Status400BadRequest)
            .WithTags("Leads")
            .RequireAuthorization("User");
    }
}