namespace Connect.Accounts.Logouts.Create;

public interface IController
{
    Task Handle(HttpContext context, long? userIdValue);
}

public class Controller(IHandler handler, ITimer timer) : IController
{
    public async Task Handle(HttpContext context, long? userIdValue)
    {
        Command? command = CreateCommand(userIdValue);
        if (command is not null)
        {
            IResult result = await handler.Handle(command, context.RequestAborted);
            
            await (result switch
            {
                LoggedOutResult => context.Status(Status202Accepted),
                NotFoundResult => context.Status(Status404NotFound),
                AlreadyLoggedOutResult => context.Status(Status202Accepted),
                _ => throw new NotImplementedException()
            });
        }
        else
        {
            await context.Status(Status400BadRequest);
        }
    }

    private Command? CreateCommand(long? userIdValue)
    {
        if(!UserId.TryParse(userIdValue, out var userId))
        {
            return null;
        }
        
        return new Command(userId, timer.UtcNow);
    }
}