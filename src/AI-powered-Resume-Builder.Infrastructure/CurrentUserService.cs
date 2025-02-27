using AI_powered_Resume_Builder.Application.Services;
using AI_powered_Resume_Builder.Domain.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace AI_powered_Resume_Builder.Infrastructure;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor, UserManager<ApplicationUser> userManager) : ICurrentUserService
{
    public Guid UserId => Guid.Parse(userManager.GetUserId(httpContextAccessor.HttpContext?.User));

    public string Email => userManager.GetUserName(httpContextAccessor.HttpContext?.User);

    public string UserName => userManager?.GetUserName(httpContextAccessor?.HttpContext?.User);

    public bool IsAuthenticated => httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;
}