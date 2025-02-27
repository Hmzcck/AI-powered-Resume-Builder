using AI_powered_Resume_Builder.Application.DTOs;
using AI_powered_Resume_Builder.Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace AI_powered_Resume_Builder.Application.Users.Queries;

public record GetAllUsersQuery : IRequest<List<UserDto>>;

public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, List<UserDto>>
{
    private readonly UserManager<ApplicationUser> _userManager;

    public GetAllUsersQueryHandler(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<List<UserDto>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await Task.Run(() => _userManager.Users.ToList(), cancellationToken);

        return users.Select(u => new UserDto
        {
            Id = u.Id.ToString(),
            UserName = u.UserName,
            Email = u.Email
        }).ToList();
    }
}
