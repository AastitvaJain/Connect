namespace Connect.Requests.Reject;

public interface IController
{
    Task Handle(HttpContext context, long? userIdValue, Request? request);
}

internal sealed class Controller(IHandler handler, ITimer timer) : IController
{
    public async Task Handle(HttpContext context, long? userIdValue, Request? request)
    {
        Command? command = CreateCommand(request, userIdValue);

        if (command is not null)
        {
            IResult result = await handler.Handle(command, context.RequestAborted);
            
            await (result switch
            {
                RejectedResult => context.Status(Status202Accepted),
                NotFoundResult => context.Status(Status404NotFound),
                CouldNotRejectResult => context.Status(Status500InternalServerError),
                _ => throw new NotImplementedException()
            });       
        }
        else
        {
            await context.Status(Status400BadRequest);
        }
    }

    private Command? CreateCommand(Request? request, long? userIdValue)
    {
        if(!UserId.TryParse(userIdValue, out UserId userId))
        {
            return null;
        }
        
        if(request is null)
            return null;

        if (request.RequestId is null || request.RequestId.Value <= 0)
        {
            return null;      
        }

        return new Command(userId, (long)request.RequestId, request.Reason ?? string.Empty, timer.UtcNow);
    }
}