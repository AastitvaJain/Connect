namespace Connect.Accounts;

public interface IUser
{
    long Id { get; }
    
    string EmailId { get; }
    
    Group Group { get; }
    
    State State { get; }
    
    string Name { get; }
}