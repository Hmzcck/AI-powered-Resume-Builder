using System.Text.Json;

namespace AI_powered_Resume_Builder.Application.Services;

public interface IResumeGenerationService
{
    public Task<JsonDocument> GenerateResumeContentAsync(string Prompt);
    public Task<JsonDocument> GenerateResumeContentWithJobDescriptionAsync(JsonDocument Content, List<string> JobDescriptions, bool UseCurrentResumeInfo = false);
    public Task<JsonDocument> GenerateResumeSectionAsync(string SectionTitle, JsonDocument ResumeContent);
}
