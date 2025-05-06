namespace Connect.Accounts.Passwords.Update;

public sealed record Identity(
    UserId Id, 
    State State, 
    Password Password)
{
    public Password Password { get; private set; } = Password;

    public DateTime? UpdateTime { get; private set; }
    
    public IEvent UpdatePassword(
        PlainPassword oldPassword,
        PlainPassword newPassword,
        DateTime currentTime)
    {
        switch (this)
        {
            case {State: State.Locked}: return new Locked();
        }

        if (!Password.Matches(oldPassword))
        {
            return new PasswordMismatch();
        }

        Password = Password.Create(newPassword, 100_000, currentTime);
        UpdateTime = currentTime;
        
        return new PasswordUpdated();
    }
}