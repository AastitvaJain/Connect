namespace Connect;

public sealed record ClientPayment(
    //Guid Id,
    float AmountPaid,
    string PaymentMode,
    int PaymentId,
    Guid? ChannelPartnerId,
    string? CustomChannelPartnerName,
    string? CustomChannelPartnerNumber);