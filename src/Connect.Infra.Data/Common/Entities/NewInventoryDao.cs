namespace Connect;

public class NewInventoryDao
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [MaxLength(255)]
    public string ProjectName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(255)]
    public string ProjectType { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(255)]
    public string UnitNo { get; set; } = string.Empty;
    
    [Required]
    public float BuiltUpArea { get; set; }
    
    [Required]
    public float Rate { get; set; }
    
    [Required]
    public float TotalConsideration { get; set; }
    
    public float? RevisedRate { get; set; }
    
    public float? RevisedTotalConsideration { get; set; }

    public static NewInventory ToNewInventory(NewInventoryDao dao)
    {
        return new(
            dao.Id,
            dao.ProjectName,
            dao.ProjectType,
            dao.UnitNo,
            dao.BuiltUpArea,
            dao.Rate,
            dao.TotalConsideration,
            dao.RevisedRate,
            dao.RevisedTotalConsideration);
    }
}