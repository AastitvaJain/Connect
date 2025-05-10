namespace Connect;

public class SoldInventoryDao
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [MaxLength(255)]
    public string? SrNo { get; set; }
    
    [MaxLength(255)]
    public string? BookingId { get; set; }
    
    [MaxLength(255)]
    public string? BookingDate { get; set; }
    
    [Required]
    [MaxLength(10)]
    public required string PropertyId { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string ProjectName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(255)]
    public string ProjectType { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(255)]
    public string UnitNo { get; set; } = string.Empty;
    
    [MaxLength(255)]
    public string? UnitCategory { get; set; }
    
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

    [MaxLength(255)]
    public string? AssuredPrice { get; set; }
    
    public float? Discount { get; set; }

    public static SoldInventory ToSoldInventory(SoldInventoryDao dao)
    {
        return new SoldInventory(
            dao.Id,
            dao.BookingId,
            DateTime.TryParse(dao.BookingDate, out var time) ? time : null,
            dao.ProjectName,
            dao.ProjectType,
            dao.UnitNo,
            dao.UnitCategory,
            dao.BuyerName,
            dao.BuiltUpArea,
            dao.Rate,
            dao.TotalConsideration,
            dao.NetReceived,
            float.TryParse(dao.AssuredPrice, out var price) ? price : 0,
            dao.Discount);
    }
}