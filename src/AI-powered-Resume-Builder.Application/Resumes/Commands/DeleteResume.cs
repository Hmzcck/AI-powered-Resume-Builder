using AI_powered_Resume_Builder.Application.Services;
using AI_powered_Resume_Builder.Domain.Resumes;
using MediatR;

namespace AI_powered_Resume_Builder.Application.Resumes.Commands;

public sealed record DeleteResumeCommand(Guid Id) : IRequest<DeleteResumeCommandResponse>;

public sealed record DeleteResumeCommandResponse(Unit Unit);

public sealed class DeleteResumeCommandHandler(IResumeRepository resumeRepository, ICurrentUserService currentUserService) : IRequestHandler<DeleteResumeCommand, DeleteResumeCommandResponse>
{
    public async Task<DeleteResumeCommandResponse> Handle(DeleteResumeCommand request, CancellationToken cancellationToken)
    {
        if(!currentUserService.IsAuthenticated)
        {
            throw new UnauthorizedAccessException();
        }

        var resume = await resumeRepository.GetByUserIdAndIdAsync(currentUserService.UserId, request.Id);

        if(resume == null)
        {
            throw new Exception("Resume not found");
        }

        await resumeRepository.DeleteAsync(request.Id);

        return new DeleteResumeCommandResponse(Unit.Value);
    }
}