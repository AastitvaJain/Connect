namespace Connect.Accounts;

public interface IAuthUserService
{
    AuthUserDto CreateAuthUserDto(IAuthUser user);
}

internal sealed class AuthUserService(IAuthService authService, IUserService userService) : IAuthUserService
{
    public AuthUserDto CreateAuthUserDto(IAuthUser user)
    {
        return new AuthUserDto(
            userService.CreateUserDto(user),
            authService.CreateAuthDto(user));
    }
}