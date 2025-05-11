namespace Connect;

public class ApprovalCostSheetDao : BaseEntity
{
    public long Id { get; set; }

    [Required]
    public required Guid PropertyRecordId { get; set; }

    public List<ApprovalCostSheetItemDao> Items { get; set; } = new();

    public long ApproveRequestId { get; set; }
    public ApproveRequestDao? ApproveRequest { get; set; }
}