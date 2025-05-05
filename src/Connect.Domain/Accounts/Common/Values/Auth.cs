namespace Connect.Accounts;

public sealed record Auth(long Token, DateTime CreateTime)
{
    public static readonly Auth Default = new(0, DateTime.UnixEpoch);

    public static Auth Create(DateTime time)
    {
        return new(Id.Create(), time);
    }
}