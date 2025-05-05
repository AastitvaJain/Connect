using System.ComponentModel.DataAnnotations;

namespace Connect;

public class AccountDao
{
    public long Id { get; set; }
    
    public required Group Group { get; set; }
    
    public required State State { get; set; }
    
    public required string EmailId { get; set; }
    
    public required string Name { get; set; }
}