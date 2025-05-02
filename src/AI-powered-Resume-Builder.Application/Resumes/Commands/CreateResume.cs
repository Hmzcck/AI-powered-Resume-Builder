using System.Text.Json;
using AI_powered_Resume_Builder.Application.Services;
using AI_powered_Resume_Builder.Domain.Resumes;
using AI_powered_Resume_Builder.Domain.Resumes.Sections;
using FluentValidation;
using MediatR;

namespace AI_powered_Resume_Builder.Application.Resumes.Commands;

public sealed record CreateResumeCommand(
    string Title, 
    JsonDocument Content, // We'll keep this for backward compatibility but parse it into sections
    float? Score, 
    List<string>? Keywords,
    List<string>? TargetJobDescriptions
) : IRequest<CreateResumeCommandResponse>;

public sealed record CreateResumeCommandResponse{
    public Guid Id { get; init; }
}

public sealed class CreateResumeCommandValidator : AbstractValidator<CreateResumeCommand>
{
    public CreateResumeCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .Length(3, 100)
            .WithMessage("Title must be between 3 and 100 characters");

        RuleFor(x => x.Content)
            .NotNull()
            .WithMessage("Resume content is required");

        RuleFor(x => x.Score)
            .InclusiveBetween(0, 100)
            .When(x => x.Score.HasValue)
            .WithMessage("Score must be between 0 and 100");

        RuleFor(x => x.Keywords)
            .NotNull()
            .WithMessage("Keywords list is required")
            .Must(x => x.All(k => !string.IsNullOrWhiteSpace(k)))
            .WithMessage("Keywords cannot contain empty values");
    }
}

internal sealed class CreateResumeCommandHandler(IResumeRepository resumeRepository, ICurrentUserService currentUserService) : IRequestHandler<CreateResumeCommand, CreateResumeCommandResponse>
{
    private T? ParseSection<T>(JsonElement content, string sectionName) where T : ResumeSection
    {
        if (content.TryGetProperty(sectionName, out JsonElement sectionElement))
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            return JsonSerializer.Deserialize<T>(sectionElement.GetRawText(), options);
        }
        return null;
    }

    private List<T> ParseSectionList<T>(JsonElement content, string sectionName) where T : ResumeSection
    {
        if (content.TryGetProperty(sectionName, out JsonElement sectionElement) && sectionElement.ValueKind == JsonValueKind.Array)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            return JsonSerializer.Deserialize<List<T>>(sectionElement.GetRawText(), options) ?? [];
        }
        return [];
    }

    public async Task<CreateResumeCommandResponse> Handle(CreateResumeCommand request, CancellationToken cancellationToken)
    {
        if(!currentUserService.IsAuthenticated)
            throw new UnauthorizedAccessException("User is not authenticated");
        
        var existingResumes = await resumeRepository.GetByUserIdAsync(currentUserService.UserId);
        if(existingResumes.Any())
            throw new InvalidOperationException("User already has a resume");

        var content = request.Content.RootElement;

        var resume = new Resume
        {
            Title = request.Title,
            Score = request.Score,
            Keywords = request.Keywords ?? [],
            TargetJobDescriptions = request.TargetJobDescriptions ?? [],
            ApplicationUserId = currentUserService.UserId
        };

        // Parse each section from the content
        resume.Summary = ParseSection<Summary>(content, "summary");
        resume.Experiences = ParseSectionList<Experience>(content, "experience");
        resume.Education = ParseSectionList<Education>(content, "education");
        resume.Skills = ParseSectionList<Skill>(content, "skills");
        resume.Projects = ParseSectionList<Project>(content, "projects");
        resume.Certifications = ParseSectionList<Certification>(content, "certifications");
        resume.Languages = ParseSectionList<Language>(content, "languages");
        resume.Awards = ParseSectionList<Award>(content, "awards");
        resume.Publications = ParseSectionList<Publication>(content, "publications");
        resume.References = ParseSectionList<Reference>(content, "references");

        // Set ResumeId and OrderIndex for each section
        if (resume.Summary != null)
        {
            resume.Summary.ResumeId = resume.Id;
            resume.Summary.OrderIndex = 0;
        }

        void SetSectionProperties<T>(ICollection<T> sections, int startIndex) where T : ResumeSection
        {
            var index = startIndex;
            foreach (var section in sections)
            {
                section.ResumeId = resume.Id;
                section.OrderIndex = index++;
            }
        }

        SetSectionProperties(resume.Experiences, 1);
        SetSectionProperties(resume.Education, resume.Experiences.Count + 1);
        SetSectionProperties(resume.Skills, resume.Education.Count + resume.Experiences.Count + 1);
        SetSectionProperties(resume.Projects, resume.Skills.Count + resume.Education.Count + resume.Experiences.Count + 1);
        SetSectionProperties(resume.Certifications, resume.Projects.Count + resume.Skills.Count + resume.Education.Count + resume.Experiences.Count + 1);
        SetSectionProperties(resume.Languages, resume.Certifications.Count + resume.Projects.Count + resume.Skills.Count + resume.Education.Count + resume.Experiences.Count + 1);
        SetSectionProperties(resume.Awards, resume.Languages.Count + resume.Certifications.Count + resume.Projects.Count + resume.Skills.Count + resume.Education.Count + resume.Experiences.Count + 1);
        SetSectionProperties(resume.Publications, resume.Awards.Count + resume.Languages.Count + resume.Certifications.Count + resume.Projects.Count + resume.Skills.Count + resume.Education.Count + resume.Experiences.Count + 1);
        SetSectionProperties(resume.References, resume.Publications.Count + resume.Awards.Count + resume.Languages.Count + resume.Certifications.Count + resume.Projects.Count + resume.Skills.Count + resume.Education.Count + resume.Experiences.Count + 1);

        await resumeRepository.CreateAsync(resume);
        return new CreateResumeCommandResponse{Id = resume.Id};
    }
}
