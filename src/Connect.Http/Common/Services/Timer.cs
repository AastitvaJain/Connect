namespace Connect;

public interface ITimer
{
    DateTime UtcNow { get; }
}

internal sealed class Timer : ITimer
{
    public DateTime UtcNow => DateTime.UtcNow;
}