using System.Text.Json;
using AI_powered_Resume_Builder.Application.Services;
using AI_powered_Resume_Builder.Infrastructure.DTOs;
using AI_powered_Resume_Builder.Infrastructure.Resumes;

namespace AI_powered_Resume_Builder.Infrastructure.Resumes;

public class ResumeGenerationService(IAiService _aiService,
SystemInstructions _instructions) : IResumeGenerationService
{
    public async Task<JsonDocument> GenerateResumeContentAsync(GenerateResumeRequest generateResumeRequest)
    {
        var Prompt = generateResumeRequest.Prompt;
        var result = await _aiService.GenerateTextAsync(
            _instructions.GetFullBuildingResumeTask(),
            Prompt,
            CancellationToken.None
        );
        var resumeJson = result.Replace("```json", "").Replace("```", "").Trim();
        return JsonDocument.Parse(resumeJson);
    }

    public async Task<JsonDocument> GenerateResumeContentWithJobDescriptionAsync(
        JsonDocument Content, 
        List<string> JobDescriptions, 
        bool UseCurrentResumeInfo = false)
    {
        var prompt = $"Current Resume: {Content.RootElement.ToString()}\n" +
                    $"Job Descriptions: {string.Join("\n", JobDescriptions)}\n" +
                    $"Use Current Resume Info: {UseCurrentResumeInfo}";

        var result = await _aiService.GenerateTextAsync(
            _instructions.GetFullBuildingResumeFromJobDescriptionsTask(),
            prompt,
            CancellationToken.None
        );
        var resumeJson = result.Replace("```json", "").Replace("```", "").Trim();
        return JsonDocument.Parse(resumeJson);
    }

    public async Task<JsonDocument> GenerateResumeSectionAsync(string SectionTitle, JsonDocument ResumeContent)
    {
        var prompt = $"Section Title: {SectionTitle}\n" +
                    $"Current Resume Content: {ResumeContent.RootElement.ToString()}";

        var result = await _aiService.GenerateTextAsync(
            _instructions.GetFullBuildingResumeSectionTask(),
            prompt,
            CancellationToken.None
        );
        var resumeJson = result.Replace("```json", "").Replace("```", "").Trim();
        return JsonDocument.Parse(resumeJson);
    }
}
