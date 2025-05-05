namespace Connect.Accounts;

public interface IAuthUser : IUser
{
    Auth Auth { get; }
}