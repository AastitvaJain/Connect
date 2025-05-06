namespace Connect;

public sealed record ClientToken(
    int Id,
    int Sequence)
{
    public static readonly ClientToken Default = new(0, 0);

    public static ClientToken Create(DateTime time)
    {
        return new(GetId(time), 0);
    }
    
    public static int GetId(DateTime time)
    {
        return time.Day >= 16
            ? time.Day - 15
            : time.Day + 16;
    }

    public string GetToken()
    {
        return $"{Id}{Sequence}";
    }
}