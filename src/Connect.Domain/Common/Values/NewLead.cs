namespace Connect;

public sealed record NewLead(
    Name Name,
    List<PropertyRecord> SellRecords,
    string? LeadStatus,
    string? InterestedProject
);