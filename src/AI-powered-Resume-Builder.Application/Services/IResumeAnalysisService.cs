using System.Text.Json;
using AI_powered_Resume_Builder.Application.DTOs;

namespace AI_powered_Resume_Builder.Application.Services;

public interface IResumeAnalysisService
{
    public Task<int> CalculateResumeScoreAsync(JsonDocument ResumeContent);
    public Task<AiFeedbackDto> GenerateFeedbackAsync(Guid ResumeId);
}
