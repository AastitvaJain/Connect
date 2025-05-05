namespace Connect;

public readonly record  struct UserId : IComparable<UserId>, IComparable
{
    public readonly long Value;
    
    public UserId(long value)
    {
        Value = value;
    }
    
    public UserId(long value, bool validate)
    {
        if (validate && !IsValid(value))
        {
            throw new ArgumentOutOfRangeException(nameof(value));
        }

        Value = value;
    }

    public static UserId Create()
    {
        return new UserId(Id.Create(), false);
    }

    public static bool TryParse(long value, out UserId userId)
    {
        if (IsValid(value))
        {
            userId = new UserId(value, false);

            return true;
        }

        userId = default;

        return false;
    }

    public static bool TryParse(long? value, out UserId userId)
    {
        if (value is not null)
        {
            return TryParse(value.Value, out userId);
        }

        userId = default;

        return false;
    }
    
    public static bool TryParse(ReadOnlySpan<char> data, out UserId userId)
    {
        if (long.TryParse(data, out long value))
        {
            return TryParse(value, out userId);
        }

        userId = default;

        return false;
    }

    private static bool IsValid(long value)
    {
        return value is >= Id.Min and <= Id.Max;
    }

    public override string ToString()
    {
        return Value.ToString();
    }

    public bool Equals(UserId other)
    {
        return Value == other.Value;
    }

    public override int GetHashCode()
    {
        return Value.GetHashCode();
    }

    public int CompareTo(UserId other)
    {
        return Value.CompareTo(other.Value);
    }

    public int CompareTo(object? obj)
    {
        if (ReferenceEquals(null, obj))
        {
            return 1;
        }

        return obj is UserId other
            ? CompareTo(other)
            : throw new ArgumentException(
                $"Object must be of type {nameof(UserId)}");
    }

    public static implicit operator long(UserId userId)
    {
        return userId.Value;
    }

    public static implicit operator string(UserId userId)
    {
        return userId.Value.ToString();
    }
}