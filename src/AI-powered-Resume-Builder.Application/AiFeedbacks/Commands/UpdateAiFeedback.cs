using System.Text.Json;
using AI_powered_Resume_Builder.Domain.AiFeedbacks;
using MediatR;

namespace AI_powered_Resume_Builder.Application.AiFeedbacks.Commands;

public sealed record UpdateAiFeedbackCommand(
    Guid Id,
    JsonDocument? Improvements,
    List<string>? MissingKeywords,
    string? Insights
) : IRequest<UpdateAiFeedbackCommandResponse>;

public sealed record UpdateAiFeedbackCommandResponse(
    Unit Unit
);

internal sealed class UpdateAiFeedbackCommandHandler(
    IAiFeedbackRepository aiFeedbackRepository) : IRequestHandler<UpdateAiFeedbackCommand, UpdateAiFeedbackCommandResponse>
{
    public async Task<UpdateAiFeedbackCommandResponse> Handle(UpdateAiFeedbackCommand request, CancellationToken cancellationToken)
    {
        var aiFeedback = await aiFeedbackRepository.GetByIdAsync(request.Id);

        if (aiFeedback == null)
        {
            throw new Exception("AiFeedback not found");
        }

        aiFeedback.Improvements = request.Improvements;
        aiFeedback.MissingKeywords = request.MissingKeywords;
        aiFeedback.Insights = request.Insights;

        await aiFeedbackRepository.UpdateAsync(aiFeedback);

        return new UpdateAiFeedbackCommandResponse(Unit.Value);
    }
}