namespace Connect;

public class ClientPaymentDao : BaseEntity  
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public float AmountPaid { get; set; }
    
    public required string PaymentMode { get; set; }
    
    public required int PaymentId { get; set; }
    
    public required int ClientId { get; set; }
    public required int ClientSequence { get; set; } 
    public ClientDao? Client { get; set; }
    
    public Guid? ChannelPartnerId { get; set; }
    public ChannelPartnerDao? ChannelPartner { get; set; }
    
    public string? CustomChannelPartnerName { get; set; }
    
    public string? CustomChannelPartnerNumber { get; set; }
}