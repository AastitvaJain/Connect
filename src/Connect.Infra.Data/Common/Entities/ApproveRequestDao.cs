namespace Connect;

public class ApproveRequestDao : BaseEntity
{
    public long Id { get; set; }

    [Required]
    public required int ClientId { get; set; }

    [Required]
    public required int ClientSequence { get; set; }

    public ClientDao? Client { get; set; }

    [Required]
    public required RequestStatus Status { get; set; }
    
    [Required]
    public required List<ApprovalPropertyRecordDao> SellPropertyChanges { get; set; } = new();
    
    [Required]
    public required List<ApprovalPropertyRecordDao> BuyPropertyChanges { get; set; } = new();

    [Required]
    public required List<ApprovalCostSheetDao> CostSheets { get; set; } = new();

    public bool IsApplied { get; set; }

    public long? CreatedBy { get; set; }

    public AccountDao? CreatedByAccount { get; set; }

    public long? UpdatedBy { get; set; }

    public AccountDao? UpdatedByAccount { get; set; }
}