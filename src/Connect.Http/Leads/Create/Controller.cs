namespace Connect.Leads.Create;

public interface IController
{
    Task Handle(HttpContext context, long? userIdValue, Request? request);
}
internal sealed class Controller(IHandler handler, ITimer timer) : IController
{
    public async Task Handle(HttpContext context, long? userIdValue, Request? request)
    {
        Command? command = CreateCommand(userIdValue, request);

        if(command is not null)
        {
            IResult result = await handler.Handle(command, context.RequestAborted);

            await (result switch
            {
                CreatedResult => context.Status(Status201Created),
                CouldNotCreateResult => context.Status(Status400BadRequest),
                AlreadyCreatedResult => context.Status(Status201Created),
                NotFoundResult => context.Status(Status404NotFound),
                _ => throw new NotImplementedException()
            });
        }
        else
        {
            await context.Status(Status400BadRequest);
        }
        
    }

    private Command? CreateCommand(long? userIdValue, Request? request)
    {
        if(!UserId.TryParse(userIdValue, out var userId))
        {
            return null;
        }

        if(request is null)
            return null;

        if(!Name.TryParse(request.Name, out var name))
        {
            return null;
        }

        if(request.SellRecords.Count == 0)
        {
            return null;
        }

        return new Command(
            userId, 
            new NewLead(
                name, 
                request.SellRecords, 
                request.LeadStatus, 
                request.InterestedProject), 
            timer.UtcNow);
    }
}