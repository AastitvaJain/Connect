namespace Connect.Accounts;

public interface IUser
{
    long Id { get; }
    UserId UserId { get; }
    Group Group { get; }
    
    State State { get; }
    
    string Name { get; }
}