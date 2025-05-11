namespace Connect.Leads.Create;

public interface IStore
{
    Task<bool> CheckSellRecords(List<PropertyRecord> sellRecords, CancellationToken cancellationToken);

    Task<bool> CheckLead(NewLead newLead, CancellationToken cancellationToken);

    Task<bool> TryAdd(NewLead newLead, UserId userId, DateTime time, CancellationToken cancellationToken);
}