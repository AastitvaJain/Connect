namespace Connect.Accounts;

public sealed record AuthUserDto(
    UserDto User,
    AuthDto Auth
    );