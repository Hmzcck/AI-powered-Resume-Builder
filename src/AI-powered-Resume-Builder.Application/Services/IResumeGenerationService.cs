using System.Text.Json;
using AI_powered_Resume_Builder.Infrastructure.DTOs;

namespace AI_powered_Resume_Builder.Application.Services;

public interface IResumeGenerationService
{
    public Task<JsonDocument> GenerateResumeContentAsync(GenerateResumeRequest generateResumeRequest);
    public Task<JsonDocument> GenerateResumeContentWithJobDescriptionAsync(JsonDocument Content, List<string> JobDescriptions, bool UseCurrentResumeInfo = false);
    public Task<JsonDocument> GenerateResumeSectionAsync(string SectionTitle, JsonDocument ResumeContent);
}
