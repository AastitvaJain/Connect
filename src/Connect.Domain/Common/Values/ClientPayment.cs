namespace Connect;

public sealed record ClientPayment(
    //Guid Id,
    float AmountPaid,
    string PaymentMode,
    string PaymentId,
    Guid? ChannelPartnerId,
    string? CustomChannelPartnerName,
    string? CustomChannelPartnerNumber);