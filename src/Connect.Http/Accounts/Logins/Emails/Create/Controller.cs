namespace Connect.Accounts.Logins.Emails.Create;

public interface IController
{
    Task Handle(HttpContext context, Request? request);
}

internal sealed class Controller(IHandler handler) : IController
{
    public async Task Handle(HttpContext context, Request? request)
    {
        Command? command = CreateCommand(request);

        if (command is not null)
        {
            IResult result = await handler.Handle(command, context.RequestAborted);
            
            // Todo: Handle result
             
        }
        else
        {
            await context.Status(Status400BadRequest);
        }
    }
    
    private Command? CreateCommand(Request? request)
    {
        if(request is null)
            return null;
        
        if(!PlainPassword.TryParse(request.Password, out PlainPassword password))
            return null;
        
        if(!UserId.TryParse(request.UserId, out UserId? userId))
            return null;
        
        return new Command(userId!, password);
    }
}