namespace Connect;

public readonly record struct PlainPassword
{
    public readonly string Value;
    
    public PlainPassword(string value, bool validate = true)
    {
        if (validate && !IsValid(value))
        {
            throw new ArgumentOutOfRangeException(nameof(value));
        }
        
        Value = value;
    }

    public static bool TryParse(string? value, out PlainPassword password)
    {
        if(value is null || !IsValid(value))
        {
            password = default;
            return false;
        }
        
        password= new PlainPassword(value, false);
        return true;
    }

    private static bool IsValid(string value)
    {
        const int minLength = 8;
        const int maxLength = 64;

        return value.Length is >= minLength and <= maxLength;
    }
    
    public override int GetHashCode() => Value.GetHashCode();
    
    public static implicit operator string(PlainPassword password) => password.Value;
}