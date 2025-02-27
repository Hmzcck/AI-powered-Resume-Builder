using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AI_powered_Resume_Builder.Application.Services;
using AI_powered_Resume_Builder.Domain.Users;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace AI_powered_Resume_Builder.Infrastructure.JWT;

public class JwtService : IJwtService
{
    private readonly IOptions<JwtOptions> _options;
    private readonly SymmetricSecurityKey _key;

    public JwtService(IOptions<JwtOptions> options)
    {
        _options = options;
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Value.SigningKey));
    }

    public Task<string> CreateTokenAsync(ApplicationUser applicationUser, CancellationToken cancellationToken = default)
    {
        var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, applicationUser.Id.ToString()),
                new Claim(ClaimTypes.Email, applicationUser.Email),
                new Claim(ClaimTypes.Name, applicationUser.UserName)
            };

        var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddDays(7),
            SigningCredentials = creds,
            Issuer = _options.Value.Issuer,
            Audience = _options.Value.Audience,
            NotBefore = DateTime.Now
        };

        var tokenHandler = new JwtSecurityTokenHandler();

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return Task.FromResult(tokenHandler.WriteToken(token));

    }
}
