namespace Connect;

public class AssuredPriceDao
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [MaxLength(255)]
    public string ProjectType { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(255)]
    public string ProjectName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(255)]
    public string UnitNo { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(255)]
    public string UniqueKey { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string AssuredPrice { get; set; } = string.Empty;
    
    public float? RevisedAssuredPrice { get; set; }
    
}