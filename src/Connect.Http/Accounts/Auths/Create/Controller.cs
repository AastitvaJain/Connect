namespace Connect.Accounts.Auths.Create;

public interface IController
{
    Task Handle(HttpContext context, Request? request);
}

internal sealed class Controller(IHandler handler, ITimer timer) : IController
{
    public async Task Handle(HttpContext context, Request? request)
    {
        Command? command = CreateCommand(request);

        if (command is not null)
        {
            IResult result = await handler.Handle(command, context.RequestAborted);

            await (result switch
            {
                CreatedResult data => context.Ok(data),
                TokenExpiredResult => context.Status(Status410Gone),
                NotFoundResult => context.Status(Status404NotFound),
                LockedResult => context.Status(Status423Locked),
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
        if (request?.RefreshToken?.Length is not 32)
        {
            return null;
        }

        ReadOnlySpan<char> idSpan = request.RefreshToken[16..].AsSpan();

        if (!UserId.TryParse(idSpan, out UserId userId))
        {
            return null;
        }

        ReadOnlySpan<char> tokenSpan = request.RefreshToken[..16].AsSpan();
        
        if (!AuthToken.TryParse(tokenSpan, out AuthToken authToken))
        {
            return null;
        }
        
        return new Command(userId, authToken, timer.UtcNow);
    }
}