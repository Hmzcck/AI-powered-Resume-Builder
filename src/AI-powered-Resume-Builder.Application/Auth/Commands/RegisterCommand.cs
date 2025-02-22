using System;
using AI_powered_Resume_Builder.Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace AI_powered_Resume_Builder.Application.Auth.Commands;

public sealed record RegisterCommand(
    string Email,
    string Password
) : IRequest<RegisterCommandResponse>;


public record RegisterCommandResponse(
    Guid UserId,
    string Email
);

internal sealed class RegisterCommandHandler(UserManager<ApplicationUser> userManager) : IRequestHandler<RegisterCommand, RegisterCommandResponse>
{
    public async Task<RegisterCommandResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var existingUser = await userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            throw new Exception("User with this email already exists");
        }

        var newUser = new ApplicationUser
        {
            Email = request.Email,
            UserName = request.Email
        };

        var result = await userManager.CreateAsync(newUser, request.Password);

        if (!result.Succeeded)
        {
            throw new Exception("Failed to create user");
        }

        return new RegisterCommandResponse(newUser.Id, newUser.Email);
    }
}