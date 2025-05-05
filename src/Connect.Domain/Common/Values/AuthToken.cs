namespace Connect;

public readonly record struct AuthToken : IComparable<AuthToken>, IComparable
{
    public static readonly TimeSpan Lifetime = TimeSpan.FromDays(30);

    public readonly long Value;

    public AuthToken(long value, bool validate = true)
    {
        if (validate && !IsValid(value))
        {
            throw new ArgumentOutOfRangeException(nameof(value));
        }

        Value = value;
    }

    public static bool TryParse(long value, out AuthToken token)
    {
        if (IsValid(value))
        {
            token = new AuthToken(value, false);

            return true;
        }

        token = default;

        return false;
    }

    public static bool TryParse(long? value, out AuthToken token)
    {
        if (value is not null)
        {
            return TryParse(value.Value, out token);
        }

        token = default;

        return false;
    }

    public static bool TryParse(ReadOnlySpan<char> data, out AuthToken token)
    {
        if (long.TryParse(data, out long value))
        {
            return TryParse(value, out token);
        }

        token = default;

        return false;
    }

    public static bool IsValid(long value)
    {
        return value is >= Id.Min and <= Id.Max;
    }

    public override string ToString()
    {
        return Value.ToString();
    }

    public bool Equals(AuthToken other)
    {
        return Value == other.Value;
    }

    public override int GetHashCode()
    {
        return Value.GetHashCode();
    }

    public int CompareTo(AuthToken other)
    {
        return Value.CompareTo(other.Value);
    }

    public int CompareTo(object? obj)
    {
        if (ReferenceEquals(null, obj))
        {
            return 1;
        }

        return obj is AuthToken other
            ? CompareTo(other)
            : throw new ArgumentException(
                $"Object must be of type {nameof(AuthToken)}");
    }

    public static implicit operator long(AuthToken guestToken)
    {
        return guestToken.Value;
    }
}