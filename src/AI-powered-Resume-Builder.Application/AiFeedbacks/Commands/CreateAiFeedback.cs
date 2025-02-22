using System.Text.Json;
using AI_powered_Resume_Builder.Domain.AiFeedbacks;
using AI_powered_Resume_Builder.Domain.Resumes;
using MediatR;

namespace AI_powered_Resume_Builder.Application.AiFeedbacks.Commands;

public sealed record CreateAiFeedbackCommand(
    Guid ResumeId,
    JsonDocument Improvements,
    List<string> MissingKeywords,
    string Insights
) : IRequest<CreateAiFeedbackCommandResponse>;

public sealed record CreateAiFeedbackCommandResponse(
    Unit Unit
);

internal sealed class CreateAiFeedbackCommandHandler(IResumeRepository resumeRepository, IAiFeedbackRepository aiFeedbackRepository) : IRequestHandler<CreateAiFeedbackCommand, CreateAiFeedbackCommandResponse>
{
    public async Task<CreateAiFeedbackCommandResponse> Handle(CreateAiFeedbackCommand request, CancellationToken cancellationToken)
    {
        var existingResume = await resumeRepository.GetByIdAsync(request.ResumeId);

        if (existingResume == null)
        {
            throw new Exception("Resume not found");
        }

        var aiFeedback = new AiFeedback {
            ResumeId = request.ResumeId,
            Improvements = request.Improvements,
            MissingKeywords = request.MissingKeywords,
            Insights = request.Insights
        };

        await aiFeedbackRepository.CreateAsync(aiFeedback);

        return new CreateAiFeedbackCommandResponse(Unit.Value);
    }
}