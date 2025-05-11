using Microsoft.AspNetCore.Mvc;

namespace Connect.Leads.Create;

public interface IHandler
{
    Task<IResult> Handle(Command command, CancellationToken cancellationToken);
}

internal sealed class Handler(IStore store) : IHandler
{
    public async Task<IResult> Handle(Command command, CancellationToken cancellationToken)
    {
        (UserId userId, NewLead newLead, DateTime currentTime) = command;

        if(await store.CheckLead(newLead, cancellationToken))
        {
            return new AlreadyCreatedResult();
        }

        if (!await store.CheckSellRecords(newLead.SellRecords, cancellationToken))
        {
            return new NotFoundResult();
        }

        if(await store.TryAdd(newLead, userId, currentTime, cancellationToken))
        {
            return new CreatedResult();
        }

        return new CouldNotCreateResult();
    }
}