namespace Connect;

public sealed record ClientPayment(
    Guid Id,
    float AmountPaid,
    string PaymentMode,
    int PaymentId,
    ChannelPartner? ChannelPartner,
    string? CustomChannelPartnerName = null,
    string? CustomChannelPartnerNumber = null);