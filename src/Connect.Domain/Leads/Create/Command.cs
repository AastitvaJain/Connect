namespace Connect.Leads.Create;

public sealed record Command(
    UserId UserId,
    NewLead NewLead,
    DateTime CurrentTime
);