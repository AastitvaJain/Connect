namespace Connect.Requests.Get.ByStatus;

public interface IController
{
    Task Handle(HttpContext context, string? status, int page, int pageSize);
}

internal sealed class Controller(IHandler handler) : IController
{
    public async Task Handle(HttpContext context, string? status, int page, int pageSize)
    {
        Command? command = CreateCommand(status, page, pageSize);

        if (command is not null)
        {
            IResult result = await handler.Handle(command, context.RequestAborted);
            
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

    private Command? CreateCommand(string? status, int page, int pageSize)
    {
        if (string.IsNullOrWhiteSpace(status))
            return null;

        if (!Enum.TryParse<RequestStatus>(status, out var requestStatus))
        {
            return null;
        }
        
        return new Command(requestStatus, page, pageSize);
    }
}