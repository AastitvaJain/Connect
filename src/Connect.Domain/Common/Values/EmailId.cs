namespace Connect;

public readonly record struct EmailId : IComparable<EmailId>, IComparable
{
    public readonly string Value;

    public EmailId(string value, bool validate = true) 
    {
        if (validate && !IsValid(value))
        {
            throw new ArgumentOutOfRangeException(nameof(value));   
        }
        
        Value = value;
    }

    public static bool TryParse(string? value, out EmailId emailId)
    {
        if (value is null || !IsValid(value))
        {
            emailId = default;
            return false;
        }
        
        emailId = new EmailId(value);
        return true;   
    }

    public static bool IsValid(string value)
    {
        if (value.Contains('\r') || value.Contains('\n'))
        {
            return false;
        }

        int index = value.IndexOf('@');

        return
            index > 0 &&
            value.Length < 64 &&
            index != value.Length - 1 &&
            index == value.LastIndexOf('@');
    }
    
    public override int GetHashCode() => Value.GetHashCode();
    
    public static implicit operator string(EmailId emailId) => emailId.Value;

    public int CompareTo(EmailId other)
    {
        return String.Compare(Value, other.Value, StringComparison.InvariantCultureIgnoreCase);
    }

    public int CompareTo(object? obj)
    {
        if(ReferenceEquals(null, obj)) 
            return 1;
        
        return obj is EmailId other 
            ? CompareTo(other) 
            : throw new ArgumentException(
                $"Object must be of type {nameof(EmailId)}");   
    }
}