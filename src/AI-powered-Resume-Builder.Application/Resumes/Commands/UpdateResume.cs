using System.Text.Json;
using AI_powered_Resume_Builder.Application.Services;
using AI_powered_Resume_Builder.Domain.Resumes;
using AI_powered_Resume_Builder.Domain.Resumes.Sections;
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

    private void UpdateSections<T>(ICollection<T> existingSections, ICollection<T> newSections, Guid resumeId) where T : ResumeSection
    {
        // Remove sections not present in new list
        var sectionsToRemove = existingSections.Where(es => 
            !newSections.Any(ns => ns.Id != Guid.Empty && ns.Id == es.Id)).ToList();
        foreach (var section in sectionsToRemove)
        {
            existingSections.Remove(section);
        }

        // Update existing and add new sections
        foreach (var newSection in newSections)
        {
            if (newSection.Id == Guid.Empty)
            {
                // New section
                newSection.ResumeId = resumeId;
                existingSections.Add(newSection);
            }
            else
            {
                // Update existing section
                var existingSection = existingSections.FirstOrDefault(es => es.Id == newSection.Id);
                if (existingSection != null)
                {
                    // Copy properties from new section to existing section
                    foreach (var property in typeof(T).GetProperties())
                    {
                        if (property.CanWrite && property.Name != "Id" && property.Name != "Resume")
                        {
                            property.SetValue(existingSection, property.GetValue(newSection));
                        }
                    }
                }
            }
        }
    }

    public async Task<UpdateResumeCommandResponse> Handle(UpdateResumeCommmand request, CancellationToken cancellationToken)
    {
        if (!currentUserService.IsAuthenticated)
        {
            throw new UnauthorizedAccessException();
        }

        var resume = await resumeRepository.GetByUserIdAndIdAsync(currentUserService.UserId, request.Id);
        if (resume == null)
        {
            throw new Exception("Resume not found");
        }

        // Update basic resume properties
        resume.Title = request.Title;
        resume.Score = request.Score;
        resume.Keywords = request.Keywords;
        resume.TargetJobDescriptions = request.TargetJobDescriptions;

        // Parse and update sections from JSON content
        var content = request.Content.RootElement;

        // Update Summary
        var newSummary = ParseSection<Summary>(content, "summary");
        if (newSummary != null)
        {
            if (resume.Summary == null)
            {
                newSummary.ResumeId = resume.Id;
                resume.Summary = newSummary;
            }
            else
            {
                resume.Summary.Content = newSummary.Content;
                resume.Summary.OrderIndex = newSummary.OrderIndex;
            }
        }

        // Update collection-based sections
        var newExperiences = ParseSectionList<Experience>(content, "experience");
        var newEducation = ParseSectionList<Education>(content, "education");
        var newSkills = ParseSectionList<Skill>(content, "skills");
        var newProjects = ParseSectionList<Project>(content, "projects");
        var newCertifications = ParseSectionList<Certification>(content, "certifications");
        var newLanguages = ParseSectionList<Language>(content, "languages");
        var newAwards = ParseSectionList<Award>(content, "awards");
        var newPublications = ParseSectionList<Publication>(content, "publications");
        var newReferences = ParseSectionList<Reference>(content, "references");

        UpdateSections(resume.Experiences, newExperiences, resume.Id);
        UpdateSections(resume.Education, newEducation, resume.Id);
        UpdateSections(resume.Skills, newSkills, resume.Id);
        UpdateSections(resume.Projects, newProjects, resume.Id);
        UpdateSections(resume.Certifications, newCertifications, resume.Id);
        UpdateSections(resume.Languages, newLanguages, resume.Id);
        UpdateSections(resume.Awards, newAwards, resume.Id);
        UpdateSections(resume.Publications, newPublications, resume.Id);
        UpdateSections(resume.References, newReferences, resume.Id);

        // Update order indices
        void SetOrderIndices<T>(ICollection<T> sections, int startIndex) where T : ResumeSection
        {
            var index = startIndex;
            foreach (var section in sections)
            {
                section.OrderIndex = index++;
            }
        }

        if (resume.Summary != null) resume.Summary.OrderIndex = 0;
        SetOrderIndices(resume.Experiences, 1);
        SetOrderIndices(resume.Education, resume.Experiences.Count + 1);
        SetOrderIndices(resume.Skills, resume.Education.Count + resume.Experiences.Count + 1);
        SetOrderIndices(resume.Projects, resume.Skills.Count + resume.Education.Count + resume.Experiences.Count + 1);
        SetOrderIndices(resume.Certifications, resume.Projects.Count + resume.Skills.Count + resume.Education.Count + resume.Experiences.Count + 1);
        SetOrderIndices(resume.Languages, resume.Certifications.Count + resume.Projects.Count + resume.Skills.Count + resume.Education.Count + resume.Experiences.Count + 1);
        SetOrderIndices(resume.Awards, resume.Languages.Count + resume.Certifications.Count + resume.Projects.Count + resume.Skills.Count + resume.Education.Count + resume.Experiences.Count + 1);
        SetOrderIndices(resume.Publications, resume.Awards.Count + resume.Languages.Count + resume.Certifications.Count + resume.Projects.Count + resume.Skills.Count + resume.Education.Count + resume.Experiences.Count + 1);
        SetOrderIndices(resume.References, resume.Publications.Count + resume.Awards.Count + resume.Languages.Count + resume.Certifications.Count + resume.Projects.Count + resume.Skills.Count + resume.Education.Count + resume.Experiences.Count + 1);

        await resumeRepository.UpdateAsync(resume);
        return new UpdateResumeCommandResponse(Unit.Value);
    }
}
