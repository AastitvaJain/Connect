namespace Connect.Admins.Offers.Update;

public interface IController
{
    Task Handle(HttpContext context, long? userIdValue, Request? request);
}

internal sealed class Controller(IHandler handler, ITimer timer) : IController
{
    public async Task Handle(HttpContext context, long? userIdValue, Request? request)
    {
        Command? command = CreateCommand(userIdValue, request);

        if (command is not null)
        {
            IResult result = await handler.Handle(command, context.RequestAborted);
            await (result switch
            {
                UpdatedResult data => context.Ok(data.ProjectOffers),
                CouldNotUpdateResult => context.Status(Status500InternalServerError),
                NotFoundResult => context.Status(Status404NotFound),
                _ => throw new NotImplementedException()
            });
        }
        else
        {
            await context.Status(Status400BadRequest);
        }
    }

    private Command? CreateCommand(long? userIdValue, Request? request)
    {
        if (!UserId.TryParse(userIdValue, out UserId userId))
        {
            return null;       
        }

        if (request is null)
            return null;

        if (request.ProjectOffers is null || request.ProjectOffers.Count == 0)
        {
            return null;
        }

        return new(userId, request.ProjectOffers, timer.UtcNow);
    }
}
