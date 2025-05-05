namespace Connect.Accounts.Signups.Emails.Create;

public interface IController
{
    Task Handle(HttpContext context, Request? request);
}

internal sealed class Controller(IHandler handler) : IController
{
    public async Task Handle(HttpContext context, Request? request)
    {
        Command? command = CreateCommand(request);
        
        if(command is not null)
        {
            IResult result = await handler.Handle(command, context.RequestAborted);
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

        if (!EmailId.TryParse(request.Email, out EmailId emailId))
        {
            return null;
        }

        if (!PlainPassword.TryParse(request.Password, out PlainPassword password))
        {
            return null;
        }

        if (!Name.TryParse(request.Name, out Name name))
        {
            return null;
        }
        
        return new Command(emailId, password, name);
    }
}