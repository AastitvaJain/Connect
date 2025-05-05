using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace Connect.Accounts;

public interface IAuthService
{
    AuthDto CreateAuthDto(IAuthUser user);
    
    AuthDto CreateAuthDto(
        long id,
        Group group,
        State state,
        Auth auth);
}

internal sealed class AuthService : IAuthService
{
    private const string TokenType = "Bearer";
    private const int Duration = 3_600; // 1 hour

    private readonly string _issuer;
    private readonly string _audience;

    private readonly SigningCredentials _credentials;
    private readonly JwtSecurityTokenHandler _handler;

    public AuthService(AuthConfig config)
    {
        (string issuer, string audience, SymmetricSecurityKey key) = config;

        _issuer = issuer;
        _audience = audience;
        
        _credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        _handler = new JwtSecurityTokenHandler();
    }
    
    public AuthDto CreateAuthDto(IAuthUser user)
    {
        return CreateAuthDto(user.Id, user.Group, user.State, user.Auth);
    }

    public AuthDto CreateAuthDto(
        long id,
        Group group,
        State state,
        Auth auth)
    {
        List<Claim> claims = new()
        {
            new Claim(Jwt.Id, id.ToString(), ClaimValueTypes.Integer64),
            new Claim(Jwt.Group, group.ToString("D"), ClaimValueTypes.Integer32),
            new Claim(Jwt.State, state.ToString("D"), ClaimValueTypes.Integer32),
        };

        if (group == Group.Admin)
        {
            claims.Add(new Claim(Jwt.Admin, "true", ClaimValueTypes.Boolean));
        }
        
        string accessToken = _handler.WriteToken(new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            expires: auth.CreateTime.AddSeconds(Duration),
            signingCredentials: _credentials));

        string refreshToken = $"{auth.Token}{id}";

        return new AuthDto(TokenType, accessToken, refreshToken, Duration);
    }
    
    private static class Jwt
    {
        public const string Id = "i";
        public const string Group = "g";
        public const string State = "s";
        public const string Admin = "a";
    }
}