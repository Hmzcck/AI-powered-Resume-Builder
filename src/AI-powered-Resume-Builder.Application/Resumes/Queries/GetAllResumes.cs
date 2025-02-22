using System;
using System.Text.Json;
using AI_powered_Resume_Builder.Application.Services;
using AI_powered_Resume_Builder.Domain.Resumes;
using MediatR;

namespace AI_powered_Resume_Builder.Application.Resumes.Queries;

public sealed record GetAllResumesQuery : IRequest<List<GetAllResumesQueryResponse>>;

public sealed record GetAllResumesQueryResponse
(
    Guid Id,
    string Title,
    JsonDocument Content,
    float? Score,
    List<string>? Keywords,
    List<string>? TargetJobDescriptions
);

internal sealed class GetAllResumesQueryHandler(IResumeRepository resumeRepository, ICurrentUserService currentUserService) : IRequestHandler<GetAllResumesQuery, List<GetAllResumesQueryResponse>>
{
    public async Task<List<GetAllResumesQueryResponse>> Handle(GetAllResumesQuery request, CancellationToken cancellationToken)
    {
        if (!currentUserService.IsAuthenticated)
            throw new UnauthorizedAccessException("User is not authenticated");

        var resumes = await resumeRepository.GetByUserIdAsync(currentUserService.UserId);

        return resumes.Select(resume => new GetAllResumesQueryResponse(
            resume.Id,
            resume.Title,
            resume.Content,
            resume.Score,
            resume.Keywords,
            resume.TargetJobDescriptions
        )).ToList();
    }
}