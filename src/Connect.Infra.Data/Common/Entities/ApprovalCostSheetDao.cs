namespace Connect;

public class ApprovalCostSheetDao : BaseEntity
{
    public long Id { get; set; }

    [Required]
    public required Guid PropertyRecordId { get; set; }

    public List<ApprovalCostSheetItemDao> Items { get; set; } = new();

    public long ApproveRequestId { get; set; }
    public ApproveRequestDao? ApproveRequest { get; set; }

    public static ApprovalCostSheetDao ToDao(ApprovalCostSheet costSheet)
    {
        return new ApprovalCostSheetDao()
        {
            PropertyRecordId = costSheet.PropertyId,
            Items = costSheet.Items.Select(ApprovalCostSheetItemDao.ToDao).ToList()
        };
    }
    
    public static ApprovalCostSheet ToDomain(ApprovalCostSheetDao dao)
    {
        return new ApprovalCostSheet(
            dao.PropertyRecordId,
            dao.Items.Select(ApprovalCostSheetItemDao.ToDomain).ToList()
        );
    }
}