using System.Text.Json;
using AI_powered_Resume_Builder.Application.Services;
using AI_powered_Resume_Builder.Domain.Resumes;
using MediatR;

namespace AI_powered_Resume_Builder.Application.Resumes.Commands;

public sealed record UpdateResumeCommmand(
    Guid Id,
    string Title,
    JsonDocument Content,
    float? Score,
    List<string>? Keywords,
    List<string>? TargetJobDescriptions
) : IRequest<UpdateResumeCommandResponse>;

public sealed record UpdateResumeCommandResponse(Unit Unit);

public sealed class UpdateResumeCommandHandler(IResumeRepository resumeRepository, ICurrentUserService currentUserService) : IRequestHandler<UpdateResumeCommmand, UpdateResumeCommandResponse>
{
    public async Task<UpdateResumeCommandResponse> Handle(UpdateResumeCommmand request, CancellationToken cancellationToken)
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

        resume.Title = request.Title;
        resume.Content = request.Content;
        resume.Score = request.Score;
        resume.Keywords = request.Keywords;
        resume.TargetJobDescriptions = request.TargetJobDescriptions;

        await resumeRepository.UpdateAsync(resume);

        return new UpdateResumeCommandResponse(Unit.Value);
    }
}
