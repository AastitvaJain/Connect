namespace Connect.Accounts;

public sealed record AuthDto(
    string TokenType,
    string AccessToken,
    string RefreshToken,
    int ExpiresInSeconds);