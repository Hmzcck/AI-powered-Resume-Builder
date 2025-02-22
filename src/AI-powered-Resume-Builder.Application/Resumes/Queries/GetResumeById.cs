using System;
using System.Text.Json;
using AI_powered_Resume_Builder.Application.Services;
using AI_powered_Resume_Builder.Domain.Resumes;
using MediatR;

namespace AI_powered_Resume_Builder.Application.Resumes.Queries;

public sealed record GetResumeByIdQuery(Guid Id)  : IRequest<GetResumeByIdQueryResponse>;

public sealed record GetResumeByIdQueryResponse(
    Guid Id,
    string Title,
    JsonDocument Content,
    float? Score,
    List<string>? Keywords,
    List<string>? TargetJobDescriptions
);


internal sealed class GetResumeByIdQueryHandler(IResumeRepository resumeRepository, ICurrentUserService currentUserService) : IRequestHandler<GetResumeByIdQuery, GetResumeByIdQueryResponse>
{
    public async Task<GetResumeByIdQueryResponse> Handle(GetResumeByIdQuery request, CancellationToken cancellationToken)
    {
        if (!currentUserService.IsAuthenticated)
            throw new UnauthorizedAccessException("User is not authenticated");

        var resume = await resumeRepository.GetByUserIdAndIdAsync(currentUserService.UserId, request.Id);

        if (resume == null)
            throw new Exception("Resume not found");

        return new GetResumeByIdQueryResponse(
            resume.Id,
            resume.Title,
            resume.Content,
            resume.Score,
            resume.Keywords,
            resume.TargetJobDescriptions
        );
    }
}