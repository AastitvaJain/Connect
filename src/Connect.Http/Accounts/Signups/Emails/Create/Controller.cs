namespace Connect.Accounts.Signups.Emails.Create;

public interface IController
{
    Task Handle(HttpContext context, Request? request);
}

internal sealed class Controller(IHandler handler, ITimer timer) : IController
{
    public async Task Handle(HttpContext context, Request? request)
    {
        Command? command = CreateCommand(request);
        
        if(command is not null)
        {
            IResult result = await handler.Handle(command, context.RequestAborted);

            await (result switch
            {
                CreatedResult data => context.Ok(data),
                EmailConflictResult => context.Status(Status409Conflict),
                IdCreationErrorResult => context.Status(Status500InternalServerError),
                _ => throw new NotImplementedException()
            });
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
        
        return new Command(emailId, password, name, timer.UtcNow);
    }
}