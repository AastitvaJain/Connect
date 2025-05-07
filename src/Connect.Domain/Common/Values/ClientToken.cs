namespace Connect;

public sealed record ClientToken(
    int Id,
    int Sequence)
{
    private const int TokenLength = 7;
        
    public static readonly ClientToken Default = new(0, 0);

    
    public static ClientToken Create(DateTime time)
    {
        return new(GetId(time), 0);
    }

    public static bool TryParse(int? value, out ClientToken? clientToken)
    {
        clientToken = null;

        if (value is null)
            return false;

        string stringValue = value.Value.ToString();
        
        if (stringValue.Length != TokenLength) 
            return false;

        if (!int.TryParse(stringValue[..1], out int id)) 
            return false;
        
        if (!int.TryParse(stringValue[1..], out int sequence)) 
            return false;

        clientToken = new ClientToken(id, sequence);
        return true;
    }
    
    private static int GetId(DateTime time)
    {
        return time.Day switch
        {
            16 => 1,
            17 => 2,
            18 => 3,
            _ => 9
        };
    }

    public string GetToken()
    {
        return $"{Id}{Sequence}";
    }
}