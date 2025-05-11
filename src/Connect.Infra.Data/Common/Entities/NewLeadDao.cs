namespace Connect;

public class NewLeadDao : BaseEntity
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(255)]
    public required string Name { get; set; }
    
    public List<PropertyRecordDao>? SellRecords { get; set; }
    
    [MaxLength(255)]
    public string? LeadStatus { get; set; }
    
    [MaxLength(255)]
    public string? InterestedProject { get; set; }
    
    public long? CreatedBy { get; set; } 
    
    public AccountDao? CreatedByAccount { get; set; }
    
    public long? UpdatedBy { get; set; } 
    
    public AccountDao? UpdatedByAccount { get; set; }
}