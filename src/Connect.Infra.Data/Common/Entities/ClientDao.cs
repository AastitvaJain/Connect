namespace Connect;

public class ClientDao : BaseEntity
{
    public int Id { get; set; }
    
    public int Sequence { get; set; }
    
    [Required]
    [MaxLength(255)]
    public required string Name { get; set; }
    
    [MaxLength(255)]
    public string? EmailId { get; set; }
    
    [MaxLength(255)]
    public string? PhoneNo { get; set; }
    
    public List<PropertyRecordDao>? SellRecords { get; set; }

    public List<PropertyRecordDao>? BuyRecords { get; set; } = null;
    
    public ClientPaymentDao? ClientPayment { get; set; } = null;
    
    public List<ApproveRequestDao>? ApproveRequests { get; set; } = null;
    
    [Required]
    public required bool IsSubmitted { get; set; }
    
    public long? CreatedBy { get; set; } 
    
    public AccountDao? CreatedByAccount { get; set; }
    
    public long? UpdatedBy { get; set; } 
    
    public AccountDao? UpdatedByAccount { get; set; }
}