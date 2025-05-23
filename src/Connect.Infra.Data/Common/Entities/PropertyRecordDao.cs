namespace Connect;

public class PropertyRecordDao
{
    public Guid Id { get; set; }
    
    public required Guid PropertyRecordId { get; set; }
    
    public float OriginalRate { get; set; }
    
    public float? DraftRate { get; set; }
    
    public float? RequestedRate { get; set; }
    
    public float? ApprovedRate { get; set; }
    
    [MaxLength(5000)]
    public string? PaymentPlan { get; set; }

    // Composite FK to ClientDao (seller)
    public int? SellerId { get; set; }
    public int? SellerSequence { get; set; }
    public ClientDao? Seller { get; set; }

    // Composite FK to ClientDao (buyer)
    public int? BuyerId { get; set; }
    public int? BuyerSequence { get; set; }
    public ClientDao? Buyer { get; set; }
    
    public Guid? NewLeadId { get; set; }
    public NewLeadDao? NewLead { get; set; }
}