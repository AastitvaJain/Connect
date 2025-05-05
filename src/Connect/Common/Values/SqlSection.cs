namespace Connect;

public sealed record SqlSection
{
    public string Server { get; init; } = null!;
    
    public int Port { get; init; }
    
    public string Database { get; init; } = null!;
    public string User { get; init; } = null!;
    public string Password { get; init; } = null!;

    public bool IsValid()
    {
        return !string.IsNullOrEmpty(Server) &&
               !string.IsNullOrEmpty(Database) &&
               !string.IsNullOrEmpty(User) &&
               Port is > 0 and <= 65535 &&
               Server.Length is >= 1 and <= 300 &&
               Database.Length is >= 1 and <= 20 &&
               User.Length is >= 1 and <= 50;
    }
}