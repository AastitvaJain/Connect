namespace Connect.Accounts.Logins.Emails.Create;

public interface IHandler
{
    Task<IResult> Handle(Command command, CancellationToken cancellationToken);
}

// internal sealed class Handler(IAuthUserService authUserService) : IHandler
// {
//     public Task<IResult> Handle(Command command, CancellationToken cancellationToken)
//     {
//         (UserId userId, PlainPassword password) = command;
//         
//         return new CreatedResult(authUserService.CreateAuthUserDto())
//     }
// }