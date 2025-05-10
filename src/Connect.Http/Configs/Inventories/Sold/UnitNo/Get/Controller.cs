namespace Connect.Configs.Inventories.Sold.UnitNo.Get;

public interface IController
{
    Task Handle(HttpContext context);
}

internal sealed class Controller(IHandler handler) : IController
{
    public async Task Handle(HttpContext context)
    {
        IResult result = await handler.Handle();

        await (result switch
        {
            GetResult data => context.Ok(data.SoldUnitNos),
            CouldNotGetResult => context.Status(Status500InternalServerError),
            _ => throw new NotImplementedException()
        });
    }
}