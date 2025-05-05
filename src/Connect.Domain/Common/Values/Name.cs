namespace Connect;

public readonly record struct Name : IComparable<Name>, IComparable
{
    public readonly string Value;
    
    public Name(string value, bool validate = true)
    {
        if (validate && !IsValid(value))
        {
            throw new ArgumentOutOfRangeException(nameof(value));
        }
        
        Value = value;
    }

    public static bool TryParse(string? value, out Name name)
    {
        if (value is null || !IsValid(value))
        {
            name = default;
            return false;
        }
        
        name = new Name(value);
        return true;
    }

    public static bool IsValid(string value)
    {
        const int minLength = 2;
        
        return value.Length >= minLength;
    }
    
    public override int GetHashCode() => Value.GetHashCode();
    
    public static implicit operator string(Name name) => name.Value;
    
    public int CompareTo(Name other)
    {
        throw new NotImplementedException();
    }

    public int CompareTo(object? obj)
    {
        throw new NotImplementedException();
    }
}