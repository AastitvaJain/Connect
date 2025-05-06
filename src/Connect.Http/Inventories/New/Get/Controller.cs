namespace Connect.Inventories.New.Get;

public interface IController
{
    Task Handle(HttpContext context, Request? request);
}

internal sealed class Controller(IHandler handler) : IController
{
    public async Task Handle(HttpContext context, Request? request)
    {
        Command? command = CreateCommand(request);

        if (command is not null)
        {
            IResult result = await handler.Handle(command, context.RequestAborted);
            
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

    private Command? CreateCommand(Request? request)
    {
        if (request is null)
        {
            return new Command(PageConstants.PageNo, PageConstants.PageSize);
        }

        return new Command(
            request.Page ?? PageConstants.PageNo, 
            request.PageSize ?? PageConstants.PageSize,
            request.ProjectNameFilter,
            request.UnitNoFilter);
    }
}