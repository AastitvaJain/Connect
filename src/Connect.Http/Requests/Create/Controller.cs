using Connect.ClientTokens.Update;

namespace Connect.Requests.Create;

public interface IController
{
    Task Handle(HttpContext context, long? userIdValue, int? tokenValue, Request? request);
}

internal sealed class Controller(IHandler handler, ITimer timer) : IController
{
    public async Task Handle(HttpContext context, long? userIdValue, int? tokenValue, Request? request)
    {
        Command? command = CreateCommand(userIdValue, tokenValue, request);

        if (command is not null)
        {
            IResult result = await handler.Handle(command, context.RequestAborted);
            
            await (result switch
            {
                CreatedResult data => context.Ok(data),
                CouldNotCreateResult => context.Status(Status500InternalServerError),
                NotFoundResult => context.Status(Status404NotFound),
                AlreadyCreatedResult => context.Status(Status409Conflict),
                _ => throw new NotImplementedException()
            });       
        }
        else
        {
            await context.Status(Status400BadRequest);
        }
    }
    
    private Command? CreateCommand(long? userIdValue, int? tokenValue, Request? request)
    {
        if (!UserId.TryParse(userIdValue, out UserId userId))
        {
            return null;
        }

        if (!ClientToken.TryParse(tokenValue, out ClientToken? clientToken))
        {
            return null;
        }

        if (request is null)
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
        
        return new Command(userId, clientToken!, new ApproveRequest(
            RequestStatus.Pending,
            request.SellPropertyChanges,
            request.BuyPropertyChanges,
            request.CostSheet,
            false),
            timer.UtcNow);       
    }
}