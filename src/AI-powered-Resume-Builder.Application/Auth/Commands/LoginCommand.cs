using System;
using AI_powered_Resume_Builder.Application.Services;
using AI_powered_Resume_Builder.Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace AI_powered_Resume_Builder.Application.Auth.Commands;

public sealed record LoginCommand(
    string Email,
    string Password
) : IRequest<LoginCommandResponse>;


public record LoginCommandResponse(
    string Token,
    string RefreshToken,
    UserDto User
);

public record UserDto(
    Guid Id,
    string Email
);


internal sealed class LoginCommandHandler(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager,
IJwtService jwtService) : IRequestHandler<LoginCommand, LoginCommandResponse>
{
    public async Task<LoginCommandResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByEmailAsync(request.Email);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        SignInResult result = await signInManager.CheckPasswordSignInAsync(user, request.Password, false);

        if (!result.Succeeded)
        {
            throw new Exception("Invalid password");
        }

        var token = await jwtService.CreateTokenAsync(user);

        return new LoginCommandResponse(token, "refreshToken", new UserDto(user.Id, user.Email!));
    }
}