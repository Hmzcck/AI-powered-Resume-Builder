using System.Text.Json;
using AI_powered_Resume_Builder.Application.Services;
using AI_powered_Resume_Builder.Domain.Resumes;
using AI_powered_Resume_Builder.Domain.Resumes.Sections;
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
    private JsonDocument ConvertSectionsToJsonDocument(Resume resume)
    {
        var sections = new Dictionary<string, object>();

        // Add summary if exists
        if (resume.Summary != null)
        {
            sections["summary"] = resume.Summary;
        }

        // Add all list-based sections
        if (resume.Experiences.Any()) sections["experience"] = resume.Experiences.OrderBy(x => x.OrderIndex);
        if (resume.Education.Any()) sections["education"] = resume.Education.OrderBy(x => x.OrderIndex);
        if (resume.Skills.Any()) sections["skills"] = resume.Skills.OrderBy(x => x.OrderIndex);
        if (resume.Projects.Any()) sections["projects"] = resume.Projects.OrderBy(x => x.OrderIndex);
        if (resume.Certifications.Any()) sections["certifications"] = resume.Certifications.OrderBy(x => x.OrderIndex);
        if (resume.Languages.Any()) sections["languages"] = resume.Languages.OrderBy(x => x.OrderIndex);
        if (resume.Awards.Any()) sections["awards"] = resume.Awards.OrderBy(x => x.OrderIndex);
        if (resume.Publications.Any()) sections["publications"] = resume.Publications.OrderBy(x => x.OrderIndex);
        if (resume.References.Any()) sections["references"] = resume.References.OrderBy(x => x.OrderIndex);

        // Convert to JSON document
        var jsonString = JsonSerializer.Serialize(sections, new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        return JsonDocument.Parse(jsonString);
    }

    public async Task<List<GetAllResumesQueryResponse>> Handle(GetAllResumesQuery request, CancellationToken cancellationToken)
    {
        if (!currentUserService.IsAuthenticated)
            throw new UnauthorizedAccessException("User is not authenticated");

        var resumes = await resumeRepository.GetByUserIdAsync(currentUserService.UserId);

        return resumes.Select(resume => new GetAllResumesQueryResponse(
            resume.Id,
            resume.Title,
            ConvertSectionsToJsonDocument(resume),
            resume.Score,
            resume.Keywords,
            resume.TargetJobDescriptions
        )).ToList();
    }
}
