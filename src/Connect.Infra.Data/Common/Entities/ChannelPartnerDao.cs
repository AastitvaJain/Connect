namespace Connect;

public class ChannelPartnerDao
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;
}