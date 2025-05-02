using System.Text.Json;
using AI_powered_Resume_Builder.Application.DTOs;
using AI_powered_Resume_Builder.Application.Services;
using AI_powered_Resume_Builder.Domain.Resumes;
using AI_powered_Resume_Builder.Domain.Resumes.Sections;

namespace AI_powered_Resume_Builder.Infrastructure.Resumes;

public class ResumeAnalysisService : IResumeAnalysisService
{
    private readonly IAiService _aiService;
    private readonly IResumeRepository _resumeRepository;
    private readonly SystemInstructions _instructions;

    public ResumeAnalysisService(
        IAiService aiService,
        IResumeRepository resumeRepository)
    {
        _aiService = aiService;
        _resumeRepository = resumeRepository;
        _instructions = new SystemInstructions();
    }

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

    public async Task<int> CalculateResumeScoreAsync(JsonDocument ResumeContent)
    {
        var prompt = $"Resume Content: {ResumeContent.RootElement.ToString()}";

        var result = await _aiService.GenerateTextAsync(
            _instructions.GetFullCalculateResumeScoreTask(),
            prompt,
            CancellationToken.None
        );

        if (int.TryParse(result, out int score))
        {
            return Math.Min(100, Math.Max(0, score)); // Ensure score is between 0-100
        }

        return 0; // Default score if parsing fails
    }

    public async Task<AiFeedbackDto> GenerateFeedbackAsync(Guid ResumeId)
    {
        var resume = await _resumeRepository.GetByIdAsync(ResumeId);
        if (resume == null)
        {
            throw new KeyNotFoundException($"Resume with ID {ResumeId} not found");
        }

        var resumeContent = ConvertSectionsToJsonDocument(resume);
        var prompt = $"Resume Content: {resumeContent.RootElement.ToString()}";

        // Get AI feedback as JSON string
        var feedbackJson = await _aiService.GenerateTextAsync(
            _instructions.GetFullGenerateResumeFeedbackTask(),
            prompt,
            CancellationToken.None
        );

        Console.WriteLine($"Raw AI Response: {feedbackJson}");
        
        // If response is empty or null, throw a specific exception
        if (string.IsNullOrEmpty(feedbackJson))
        {
            throw new FormatException("AI service returned an empty response");
        }

        // Clean up response if needed (in case it comes back with markdown code blocks)
        feedbackJson = feedbackJson.Trim();
        
        // Look for JSON within the response
        int jsonStart = feedbackJson.IndexOf('{');
        int jsonEnd = feedbackJson.LastIndexOf('}');
        
        if (jsonStart >= 0 && jsonEnd > jsonStart)
        {
            // Extract just the JSON part
            feedbackJson = feedbackJson.Substring(jsonStart, jsonEnd - jsonStart + 1);
            Console.WriteLine($"Extracted JSON: {feedbackJson}");
        }
        else if (feedbackJson.StartsWith("```json") && feedbackJson.EndsWith("```"))
        {
            feedbackJson = feedbackJson.Substring(7, feedbackJson.Length - 10).Trim();
        }
        else if (feedbackJson.StartsWith("`") || feedbackJson.EndsWith("`"))
        {
            feedbackJson = feedbackJson.Trim('`');
        }

        try
        {
            // Parse the feedback JSON
            var feedbackDoc = JsonDocument.Parse(feedbackJson);
            var root = feedbackDoc.RootElement;

            // Check for required properties
            if (!root.TryGetProperty("improvements", out var improvementsElement) ||
                !root.TryGetProperty("missingKeywords", out var missingKeywordsElement) ||
                !root.TryGetProperty("insights", out var insightsElement))
            {
                // Check alternate property names (improved_resume, missing_keywords)
                bool hasAlternateProps = true;
                if (!root.TryGetProperty("improved_resume", out improvementsElement))
                    hasAlternateProps = false;
                
                if (!root.TryGetProperty("missing_keywords", out missingKeywordsElement))
                    hasAlternateProps = false;
                
                if (!root.TryGetProperty("insights", out insightsElement))
                    hasAlternateProps = false;
                    
                if (!hasAlternateProps)
                    throw new FormatException("Invalid AI feedback format: missing required properties. Available properties: " + 
                                             string.Join(", ", root.EnumerateObject().Select(p => p.Name)));
            }

            // Extract improvements as a separate JsonDocument
            var improvementsJson = improvementsElement.GetRawText();
            var improvements = JsonDocument.Parse(improvementsJson);

            // Extract missing keywords
            List<string> missingKeywords;
            if (missingKeywordsElement.ValueKind == JsonValueKind.Array)
            {
                missingKeywords = missingKeywordsElement.EnumerateArray()
                    .Select(x => x.GetString())
                    .Where(x => x != null)
                    .ToList()!;
            }
            else
            {
                var keywordsString = missingKeywordsElement.GetString() ?? string.Empty;
                missingKeywords = keywordsString
                    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                    .ToList();
            }

            // Extract insights
            var insights = insightsElement.GetString() ?? "No insights available";

            return new AiFeedbackDto(
                Improvements: improvements,
                MissingKeywords: missingKeywords,
                Insights: insights
            );
        }
        catch (JsonException ex)
        {
            throw new FormatException($"Failed to process AI feedback: {ex.Message}\nRaw response: {feedbackJson}", ex);
        }
    }
}
