namespace Connect.Accounts;

public sealed record UserDto(
    long Id,
    string EmailId,
    Group Group,
    State State,
    string Name);