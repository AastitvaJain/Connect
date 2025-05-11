namespace Connect;

public class ApprovalCostSheetItemDao : BaseEntity
{
    public long Id { get; set; }

    public long CostSheetId { get; set; }

    [Required]
    [MaxLength(255)]
    public required string Particular { get; set; }

    public float? PaymentPercentage { get; set; }

    public float? TotalPaymentWithoutTax { get; set; }

    public float? FtAdjustment { get; set; }

    public float? DiscountAdjustment { get; set; }

    public float? NetPayableByCustomer { get; set; }

    public float? GstPayable { get; set; }

    [Required]
    public required int Sequence { get; set; }

    public ApprovalCostSheetDao? CostSheet { get; set; }

    public static ApprovalCostSheetItemDao ToDao(ApprovalCostSheetItem item)
    {
        return new ApprovalCostSheetItemDao()
        {
            Particular = item.Particular,
            PaymentPercentage = item.PaymentPercentage,
            TotalPaymentWithoutTax = item.TotalPaymentWithoutTax,
            FtAdjustment = item.FtAdjustment,
            DiscountAdjustment = item.DiscountAdjustment,
            NetPayableByCustomer = item.NetPayableByCustomer,
            GstPayable = item.GstPayable,
            Sequence = item.Sequence,
        };
    }

    public static ApprovalCostSheetItem ToDomain(ApprovalCostSheetItemDao dao)
    {
        return new ApprovalCostSheetItem(
            dao.Particular,
            dao.PaymentPercentage,
            dao.TotalPaymentWithoutTax,
            dao.FtAdjustment,
            dao.DiscountAdjustment,
            dao.NetPayableByCustomer,
            dao.GstPayable,
            dao.Sequence
        );
    }
}