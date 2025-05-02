using AI_powered_Resume_Builder.Application.DTOs;
using AI_powered_Resume_Builder.Application.Mapping;
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
    public async Task<ActionResult<ResumeDto>> GenerateResume([FromBody] GenerateResumeRequest generateResumeRequest)
    {   
        try 
        {
            if (string.IsNullOrEmpty(generateResumeRequest?.Prompt))
            {
                return BadRequest("Prompt cannot be null or empty");
            }

            var result = await _resumeGenerationService.GenerateResumeContentAsync(generateResumeRequest);
            
            try 
            {
                var resumeDto = ResumeMappingExtensions.FromJsonDocument(result);
                return Ok(resumeDto);
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"Failed to deserialize resume: {ex.Message}");
                return BadRequest($"Invalid resume format: {ex.Message}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error generating resume: {ex.Message}");
            return StatusCode(500, "An error occurred while generating the resume");
        }
    }

    public record GenerateResumeFromJobsRequest(ResumeDto Content, List<string> JobDescriptions, bool UseCurrentResumeInfo = false);

    [HttpPost("generate-resume-from-jobs")]
    public async Task<ActionResult<ResumeDto>> GenerateResumeFromJobs([FromBody] GenerateResumeFromJobsRequest request)
    {
        try
        {
            if (request?.Content == null)
            {
                return BadRequest("Resume content cannot be null");
            }
            if (request.JobDescriptions == null || !request.JobDescriptions.Any())
            {
                return BadRequest("Job descriptions cannot be null or empty");
            }

            var result = await _resumeGenerationService.GenerateResumeContentWithJobDescriptionAsync(
                request.Content.ToJsonDocument(),
                request.JobDescriptions,
                request.UseCurrentResumeInfo);
            
            try
            {
                var resumeDto = ResumeMappingExtensions.FromJsonDocument(result);
                return Ok(resumeDto);
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"Failed to deserialize resume: {ex.Message}");
                return BadRequest($"Invalid resume format: {ex.Message}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error generating resume from jobs: {ex.Message}");
            return StatusCode(500, "An error occurred while generating the resume from job descriptions");
        }
    }

    public record GenerateResumeSectionRequest(string SectionTitle, ResumeDto ResumeContent);

    [HttpPost("generate-resume-section")]
    public async Task<ActionResult<ResumeDto>> GenerateResumeSection([FromBody] GenerateResumeSectionRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request?.SectionTitle))
            {
                return BadRequest("Section title cannot be null or empty");
            }
            if (request.ResumeContent == null)
            {
                return BadRequest("Resume content cannot be null");
            }

            var result = await _resumeGenerationService.GenerateResumeSectionAsync(
                request.SectionTitle,
                request.ResumeContent.ToJsonDocument());
            
            try
            {
                var resumeDto = ResumeMappingExtensions.FromJsonDocument(result);
                return Ok(resumeDto);
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"Failed to deserialize resume section: {ex.Message}");
                return BadRequest($"Invalid resume format: {ex.Message}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error generating resume section: {ex.Message}");
            return StatusCode(500, "An error occurred while generating the resume section");
        }
    }

    [HttpPost("generate-feedback/{resumeId}")]
    public async Task<ActionResult<AiFeedbackDto>> GenerateResumeFeedback(Guid resumeId)
    {
        try
        {
            if (resumeId == Guid.Empty)
            {
                return BadRequest("Invalid resume ID");
            }

            var result = await _resumeAnalysisService.GenerateFeedbackAsync(resumeId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error generating feedback: {ex.Message}");
            return StatusCode(500, "An error occurred while generating the resume feedback");
        }
    }

    [HttpPost("calculate-score")]
    public async Task<ActionResult<int>> CalculateResumeScore([FromBody] ResumeDto resumeContent)
    {
        try
        {
            if (resumeContent == null)
            {
                return BadRequest("Resume content cannot be null");
            }

            var result = await _resumeAnalysisService.CalculateResumeScoreAsync(resumeContent.ToJsonDocument());
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error calculating resume score: {ex.Message}");
            return StatusCode(500, "An error occurred while calculating the resume score");
        }
    }
}
