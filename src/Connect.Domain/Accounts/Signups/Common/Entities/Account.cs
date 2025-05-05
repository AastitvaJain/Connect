namespace Connect.Accounts.Signups;

public sealed record Account(
    long Id,
    string EmailId,
    Group Group,
    State State,
    string Name,
    Password Password,
    Auth Auth
    ) : IAuthUser
{
    public static Account Create(
        UserId id,
        EmailId emailId,
        Name name,
        PlainPassword password,
        DateTime currentTime)
    {
        return new Account(
            id, 
            emailId, 
            Group.User, 
            State.Active, 
            name, 
            Password.Create(password, 100_000, currentTime),
            Auth.Create(currentTime));
    }
        
}