namespace Connect;

public class ProjectOfferDao : BaseEntity
{
    [Required]
    [MaxLength(10)]
    public required string Id { get; set; }
    
    [Required]
    [MaxLength(255)]
    public required string ProjectName { get; set; }
    
    public float? OfferAmount { get; set; }
    
    public long? CreatedBy { get; set; } 
    
    public long? UpdatedBy { get; set; } 
    
    public AccountDao? UpdatedByAccount { get; set; }
}