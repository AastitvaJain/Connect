namespace Connect.Accounts;

public sealed record UserDto(
    long Id,
    string UserId,
    Group Group,
    State State,
    string Name
    );