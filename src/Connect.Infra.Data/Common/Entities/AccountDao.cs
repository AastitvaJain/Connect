using System.ComponentModel.DataAnnotations;
using Connect.Accounts;

namespace Connect;

public class AccountDao : BaseEntity
{
    public long Id { get; set; }
    
    [Required]
    public Group Group { get; set; }
    
    [Required]
    public State State { get; set; }
    
    [Required]
    [MaxLength(256)]
    public string EmailId { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(256)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public required Password Password { get; set; }
    
    [Required]
    public required Auth Auth { get; set; }
}