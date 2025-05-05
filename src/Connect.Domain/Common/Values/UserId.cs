namespace Connect;

public sealed record UserId(
    string Prefix,
    int Postfix,
    string Value)
{
    private const int PrefixLength = 3;
    private const int PostfixLength = 3;

    public static bool TryParse(string? value, out UserId? userId)
    {
        if (value is null || value.Length != PrefixLength + PostfixLength || !int.TryParse(value[PrefixLength..], out int postfix))
        {
            userId = null;
            return false;
        }

        userId = new UserId(value[..PrefixLength], postfix, value);
        return true;
    }
}