using System;

namespace AI_powered_Resume_Builder.Application.Services;

public interface ICurrentUserService
{
    Guid UserId { get; }
    string Email { get; }
    bool IsAuthenticated { get; }
}