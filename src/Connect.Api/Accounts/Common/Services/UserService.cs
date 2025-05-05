namespace Connect.Accounts;

public interface IUserService
{
    UserDto CreateUserDto(IUser user);
}

internal sealed class UserService : IUserService
{
    public UserDto CreateUserDto(IUser user)
    {
        return new UserDto(
            user.Id,
            user.EmailId,
            user.Group,
            user.State,
            user.Name);
    }
}