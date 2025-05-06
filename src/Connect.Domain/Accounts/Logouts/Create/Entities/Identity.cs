namespace Connect.Accounts.Logouts.Create;

public sealed record Identity(UserId Id, Auth? Auth)
{
    public Auth? Auth { get; private set; } = Auth;

    public DateTime? UpdateTime { get; private set; }

    public IEvent Logout(DateTime time)
    {
        if (Auth is null)
        {
            return new AlreadyLoggedOut();
        }

        Auth = null;

        UpdateTime = time;

        return new LoggedOut();
    }
}
