namespace Connect.Accounts.Auths.Create;

public sealed record Identity(
    UserId Id,
    Group Group,
    State State,
    Auth? Auth)
{
    public Auth? Auth { get; private set; } = Auth;

    public IEvent Authorise(AuthToken token, DateTime time)
    {
        switch (this)
        {
            case {State: State.Locked}: return new Locked();
        }

        if (Auth is null || !Auth.Token.Equals(token))
        {
            return new TokenMismatch();
        }

        TimeSpan timeDiff = time - Auth.CreateTime;

        if (timeDiff > AuthToken.Lifetime)
        {
            return new TokenExpired();
        }

        Auth = Auth.Create(time);

        return new Authorised();
    }
}