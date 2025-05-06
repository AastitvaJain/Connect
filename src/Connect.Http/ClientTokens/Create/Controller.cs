namespace Connect.ClientTokens.Create;

public interface IController
{
    Task Handle(HttpContext context, long? userIdValue, Request? request);
}

internal sealed class Controller(IHandler handler, ITimer timer) : IController
{
    public async Task Handle(HttpContext context, long? userIdValue, Request? request)
    {
        Command? command = CreateCommand(userIdValue, request);

        if (command is not null)
        {
            IResult result = await handler.Handle(command, context.RequestAborted);
            await (result switch
            {
                CreatedResult data => context.Ok(data),
                AlreadyCreatedResult data => context.Ok(data),
                CouldNotCreateResult => context.Status(Status500InternalServerError),
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
        if(request is null)
            return null;

        if (!UserId.TryParse(userIdValue, out UserId userId))
        {
            return null;
        }

        if (!Name.TryParse(request.Name, out Name name))
        {
            return null;
        }
        
        EmailId.TryParse(request.Email, out EmailId emailId);

        List<PropertyRecord>? sellRecords = request.SellRecords?.Select(x => new PropertyRecord(x)).ToList();
        
        return new Command(userId, name, timer.UtcNow, emailId, request.PhoneNumber, sellRecords);
    }
}