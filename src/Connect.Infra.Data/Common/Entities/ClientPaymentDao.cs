namespace Connect;

public class ClientPaymentDao : BaseEntity  
{
    public Guid Id { get; set; }
    
    public float AmountPaid { get; set; }
    
    [Required]
    [MaxLength(255)]
    public required string PaymentMode { get; set; }
    
    [Required]
    [MaxLength(255)]
    public required string PaymentId { get; set; }
    
    [Required]
    public required float TotalBuyAmount { get; set; }
    
    [Required]
    public required float TotalSellAmount { get; set; }
    
    public required int ClientId { get; set; }
    public required int ClientSequence { get; set; } 
    public ClientDao? Client { get; set; }
    
    [MaxLength(255)]
    public string? ChannelPartnerId { get; set; }
    
    public string? CustomChannelPartnerName { get; set; }
    
    public string? CustomChannelPartnerNumber { get; set; }
}