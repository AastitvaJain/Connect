namespace Connect.Requests.Approve;

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
                ApprovedResult => context.Status(Status202Accepted),
                NotFoundResult => context.Status(Status404NotFound),
                CouldNotApproveResult => context.Status(Status500InternalServerError),
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
        if (!UserId.TryParse(userIdValue, out UserId userId))
        {
            return null;
        }

        if (request is null)
        {
            return null;       
        }

        if (request.RequestId is null || request.RequestId.Value <= 0)
        {
            return null;      
        }

        if (request.BuyPropertyChanges is null || request.BuyPropertyChanges.Count == 0)
        {
            return null;       
        }

        if (request.CostSheet is null || request.CostSheet.Count == 0 ||
            request.CostSheet.Count != request.BuyPropertyChanges.Count)
        {
            return null;      
        }
        
        return new Command(userId, (long)request.RequestId , new ApproveRequest(
                RequestStatus.Approved,
                request.SellPropertyChanges,
                request.BuyPropertyChanges,
                request.CostSheet,
                true,
                request.Reason ?? string.Empty),
            timer.UtcNow);       
    }

}