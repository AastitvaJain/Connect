namespace Connect.Accounts.Passwords.Update;

public interface IController
{
    Task Handle(HttpContext context, long? userIdValue, Request? request);
}

internal sealed class Controller(IHandler handler, ITimer timer) : IController
{
    public async Task Handle(HttpContext context, long? userIdValue, Request? request)
    {
        Command? command = CreateCommand(request, userIdValue);
        
        if(command is not null)
        {
            IResult result = await handler.Handle(command, context.RequestAborted);
            
            await (result switch
            {
                UpdatedResult => context.Status(Status202Accepted),
                PasswordMismatchResult => context.Status(Status409Conflict),
                LockedResult => context.Status(Status423Locked),
                NotFoundResult => context.Status(Status404NotFound),
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
        if(request is null)
            return null;

        if (!UserId.TryParse(userIdValue, out UserId userId))
        {
            return null;
        }

        if (!PlainPassword.TryParse(request.OldPassword, out PlainPassword oldPassword))
        {
            return null;
        }
        
        if (!PlainPassword.TryParse(request.NewPassword, out PlainPassword newPassword))
        {
            return null;
        }
        
        return new Command(userId, oldPassword, newPassword, timer.UtcNow);
    }
}