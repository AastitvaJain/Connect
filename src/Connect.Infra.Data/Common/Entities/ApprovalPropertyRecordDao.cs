namespace Connect;

public class ApprovalPropertyRecordDao : BaseEntity
{
    public long Id { get; set; }

    public Guid PropertyRecordId { get; set; }
    
    [Required]
    public required float OriginalRate { get; set; }

    public float? ProposedRate { get; set; }
    
    public long? SellApproveRequestId { get; set; }

    public ApproveRequestDao? SellApproveRequest { get; set; }
    
    public long? BuyApproveRequestId { get; set; }
    
    public ApproveRequestDao? BuyApproveRequest { get; set; }
}