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
    
    public long? CreatedBy { get; set; } 
    
    public AccountDao? CreatedByAccount { get; set; }
    
    public long? UpdatedBy { get; set; } 
    
    public AccountDao? UpdatedByAccount { get; set; } 
}