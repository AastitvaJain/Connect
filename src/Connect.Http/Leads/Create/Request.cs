namespace Connect.Leads.Create;

public sealed record Request(
    string Name,
    List<PropertyRecord> SellRecords,
    string? LeadStatus,
    string? InterestedProject
    );