namespace Connect;

public class PropertyRecordDao
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public required Guid PropertyRecordId { get; set; }
    
    public float? Rate { get; set; }
    
    [MaxLength(100)]
    public string? PaymentPlan { get; set; }

    // Composite FK to ClientDao (seller)
    public int? SellerId { get; set; }
    public int? SellerSequence { get; set; }
    public ClientDao? Seller { get; set; }

    // Composite FK to ClientDao (buyer)
    public int? BuyerId { get; set; }
    public int? BuyerSequence { get; set; }
    public ClientDao? Buyer { get; set; }
}