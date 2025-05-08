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
    [MaxLength(255)]
    public string ProjectType { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(255)]
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

    [Required]
    public float AssuredPrice { get; set; }
    
    public float? RevisedAssuredPrice { get; set; }

    public static SoldInventory ToSoldInventory(SoldInventoryDao dao)
    {
        return new SoldInventory(
            dao.Id,
            dao.BookingId,
            dao.BookingDate,
            dao.ProjectName,
            dao.ProjectType,
            dao.UnitNo,
            dao.UniqueKey,
            dao.BuyerName,
            dao.BuiltUpArea,
            dao.Rate,
            dao.TotalConsideration,
            dao.NetReceived,
            dao.AssuredPrice,
            dao.RevisedAssuredPrice);
    }
}