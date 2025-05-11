namespace Connect.Requests.Get.ByToken;

public interface IController
{
    Task Handle(HttpContext context, int? tokenValue);
}

internal sealed class Controller(IHandler handler) : IController
{
    public async Task Handle(HttpContext context, int? tokenValue)
    {
        if (ClientToken.TryParse(tokenValue, out var token))
        {
            IResult result = await handler.Handle(token!, context.RequestAborted);
            
            await (result switch
            {
                GetResult data => context.Ok(data.Requests),
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