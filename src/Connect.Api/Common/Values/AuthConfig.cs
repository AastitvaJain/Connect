using Microsoft.IdentityModel.Tokens;

namespace Connect;

public sealed record AuthConfig(
    string Issuer,
    string Audience,
    SymmetricSecurityKey SecretKey);