namespace Connect.Accounts.Logins.Emails.Create;

public sealed record Identity(
    UserId Id,
    State State,
    Password Password)
{
    public Auth? Auth { get; private set; }

    public IEvent Login(PlainPassword password, DateTime time)
    {
        if (State == State.Locked)
            return new Locked();

        if (!Password.Matches(password))
        {
            return new PasswordMismatch();
        }
        
        Auth = Auth.Create(time);

        return new LoggedIn();
    }
}