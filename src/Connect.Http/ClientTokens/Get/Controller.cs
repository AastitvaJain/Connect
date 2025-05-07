namespace Connect.ClientTokens.Get;

public interface IController
{
    Task Handle(HttpContext context, int? token);
}

internal sealed class Controller(IHandler handler) : IController
{
    public async Task Handle(HttpContext context, int? token)
    {
        if (ClientToken.TryParse(token, out ClientToken? clientToken))
        {
            IResult result = await handler.Handle(clientToken!, context.RequestAborted);
            await (result switch
            {
                GetResult data => context.Ok(data),
                NotFoundResult => context.Status(Status404NotFound),
                _ => throw new NotImplementedException()
            });
        }
        else
        {
            await context.Status(Status400BadRequest);
        }
    }
}