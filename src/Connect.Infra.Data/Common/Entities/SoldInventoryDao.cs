namespace Connect;

public class SoldInventoryDao
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [MaxLength(255)]
    public string? BookingId { get; set; }
    
    [Required]
    public DateTime BookingDate { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string ProjectName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string ProjectType { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string UnitNo { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(255)]
    public string UniqueKey { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(255)]
    public string BuyerName { get; set; } = string.Empty;
    
    [Required]
    public float BuiltUpArea { get; set; }
    
    [Required]
    public float Rate { get; set; }
    
    [Required]
    public float TotalConsideration { get; set; }
    
    [Required]
    public float NetReceived { get; set; }
}