namespace Connect;

internal sealed record DbConfig(
    string Server,
    int Port,
    string Database,
    string User,
    string Password);