namespace Connect.ClientTokens.Update;

public interface IController
{
    Task Handle(HttpContext context, int? tokenValue, long? userIdValue, Request? request);
}

internal sealed class Controller(IHandler handler, ITimer timer) : IController
{
    public async Task Handle(HttpContext context, int? tokenValue, long? userIdValue, Request? request)
    {
        Command? command = CreateCommand(tokenValue, userIdValue, request);

        if (command is not null)
        {
            IResult result = await handler.Handle(command, context.RequestAborted);
            await (result switch
            {
                UpdatedResult data => context.Ok(data),
                CouldNotUpdateResult => context.Status(Status500InternalServerError),
                NotFoundResult => context.Status(Status404NotFound),
                AlreadySubmittedResult => context.Status(Status409Conflict),
                _ => throw new NotImplementedException()
            });
        }
        else
        {
            await context.Status(Status400BadRequest);
        }
    }
    
    private Command? CreateCommand(int? tokenValue, long? userIdValue, Request? request)
    {
        if(tokenValue is null || request is null || userIdValue is null)
            return null;

        if (!UserId.TryParse(userIdValue, out UserId userId))
        {
            return null;       
        }

        if (!ClientToken.TryParse(tokenValue, out ClientToken? clientToken))
        {
            return null;
        }

        Name.TryParse(request.Name, out Name name);
        
        EmailId.TryParse(request.Email, out EmailId emailId);

        if (string.IsNullOrWhiteSpace(name.Value)
            && string.IsNullOrWhiteSpace(emailId.Value)
            && string.IsNullOrWhiteSpace(request.PhoneNumber)
            && (request.SellRecords is null || request.SellRecords.Count == 0)
            && (request.BuyRecords is null || request.BuyRecords.Count == 0)
            && request.Payment is null)
        {
            return null;
        }
        
        if(request.Payment is not null && 
           (request.Payment.AmountPaid <= 0 
            || string.IsNullOrEmpty(request.Payment.PaymentId) 
            || string.IsNullOrEmpty(request.Payment.PaymentMode)))
            return null;
        
        return new Command(
            userId,
            clientToken!, 
            timer.UtcNow, 
            string.IsNullOrWhiteSpace(name.Value) ? null : name, 
            string.IsNullOrWhiteSpace(emailId.Value) ? null : emailId, 
            string.IsNullOrWhiteSpace(request.PhoneNumber) ? null : request.PhoneNumber,
            request.SellRecords is null || request.SellRecords.Count == 0 ? null : request.SellRecords,
            request.BuyRecords is null || request.BuyRecords.Count == 0 ? null : request.BuyRecords,
            request.Payment,
            request.IsSubmitted ?? false);
    }
}