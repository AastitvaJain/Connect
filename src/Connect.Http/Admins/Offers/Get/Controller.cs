namespace Connect.Admins.Offers.Get;

public interface IController
{
    Task Handle(HttpContext context);
}

internal sealed class Controller(IHandler handler) : IController
{
    public async Task Handle(HttpContext context)
    {
        IResult result = await handler.Handle(context.RequestAborted);

        await (result switch
        {
            GetResult data => context.Ok(data.ProjectOffers),
            CouldNotGetResult => context.Status(Status500InternalServerError),
            _ => throw new NotImplementedException()
        });
    }
}