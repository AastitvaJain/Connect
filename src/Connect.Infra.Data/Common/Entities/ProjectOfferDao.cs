namespace Connect;

public class ProjectOfferDao
{
    [Required]
    [MaxLength(10)]
    public required string Id { get; set; }
    
    [Required]
    [MaxLength(255)]
    public required string ProjectName { get; set; }
    
    public float? OfferAmount { get; set; }
}