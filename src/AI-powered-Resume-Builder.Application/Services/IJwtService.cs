using System;
using AI_powered_Resume_Builder.Domain.Users;

namespace AI_powered_Resume_Builder.Application.Services;

public interface IJwtService
{
    public Task<string> CreateTokenAsync(ApplicationUser user, CancellationToken cancellationToken = default);
}