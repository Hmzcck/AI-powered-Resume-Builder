using System.Text.Json;
using AI_powered_Resume_Builder.Application.DTOs;
using AI_powered_Resume_Builder.Application.Services;
using AI_powered_Resume_Builder.Infrastructure.DTOs;
using AI_powered_Resume_Builder.WebApi.Common;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AI_powered_Resume_Builder.WebApi.Controllers;

public class AiController : ApiController
{
    private readonly IResumeGenerationService _resumeGenerationService;
    private readonly IResumeAnalysisService _resumeAnalysisService;

    public AiController(
        IMediator mediator,
        IResumeGenerationService resumeGenerationService,
        IResumeAnalysisService resumeAnalysisService) : base(mediator)
    {
        _resumeGenerationService = resumeGenerationService;
        _resumeAnalysisService = resumeAnalysisService;
    }

    [HttpPost("generate-resume")]
    public async Task<ActionResult<JsonDocument>> GenerateResume([FromBody] GenerateResumeRequest generateResumeRequest)
    {   
        var result = await _resumeGenerationService.GenerateResumeContentAsync(generateResumeRequest);
        return Ok(result);
    }

    public record GenerateResumeFromJobsRequest(JsonDocument Content, List<string> JobDescriptions, bool UseCurrentResumeInfo = false);

    [HttpPost("generate-resume-from-jobs")]
    public async Task<ActionResult<JsonDocument>> GenerateResumeFromJobs([FromBody] GenerateResumeFromJobsRequest request)
    {
        var result = await _resumeGenerationService.GenerateResumeContentWithJobDescriptionAsync(
            request.Content,
            request.JobDescriptions,
            request.UseCurrentResumeInfo);
        
        return Ok(result);
    }

    public record GenerateResumeSectionRequest(string SectionTitle, JsonDocument ResumeContent);

    [HttpPost("generate-resume-section")]
    public async Task<ActionResult<JsonDocument>> GenerateResumeSection([FromBody] GenerateResumeSectionRequest request)
    {
        var result = await _resumeGenerationService.GenerateResumeSectionAsync(
            request.SectionTitle,
            request.ResumeContent);
        
        return Ok(result);
    }

    [HttpPost("generate-feedback/{resumeId}")]
    public async Task<ActionResult<AiFeedbackDto>> GenerateResumeFeedback(Guid resumeId)
    {
        var result = await _resumeAnalysisService.GenerateFeedbackAsync(resumeId);
        return Ok(result);
    }

    [HttpPost("calculate-score")]
    public async Task<ActionResult<int>> CalculateResumeScore([FromBody] JsonDocument resumeContent)
    {
        var result = await _resumeAnalysisService.CalculateResumeScoreAsync(resumeContent);
        return Ok(result);
    }
}
