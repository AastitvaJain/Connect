namespace Connect;

public sealed record ClientPayment(
    //Guid Id,
    float AmountPaid,
    string PaymentMode,
    string PaymentId,
    string? ChannelPartnerId,
    string? CustomChannelPartnerName,
    string? CustomChannelPartnerNumber);