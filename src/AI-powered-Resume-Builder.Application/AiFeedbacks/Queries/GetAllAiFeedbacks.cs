using System.Text.Json;
using AI_powered_Resume_Builder.Domain.AiFeedbacks;
using MediatR;

namespace AI_powered_Resume_Builder.Application.AiFeedbacks.Queries;

public sealed record GetAllAiFeedbacks : IRequest<List<GetAllAiFeedbacksResponse>>;

public sealed record GetAllAiFeedbacksResponse(
    Guid Id,
    Guid ResumeId,
    JsonDocument Improvements,
    List<string> MissingKeywords,
    string Insights
);

internal sealed class GetAllAiFeedbacksHandler(IAiFeedbackRepository aiFeedbackRepository) : IRequestHandler<GetAllAiFeedbacks, List<GetAllAiFeedbacksResponse>>
{
    public async Task<List<GetAllAiFeedbacksResponse>> Handle(GetAllAiFeedbacks request, CancellationToken cancellationToken)
    {
        var aiFeedbacks = await aiFeedbackRepository.GetAllAsync();

        return aiFeedbacks.Select(aiFeedback => new GetAllAiFeedbacksResponse(
            aiFeedback.Id,
            aiFeedback.ResumeId,
            aiFeedback.Improvements,
            aiFeedback.MissingKeywords,
            aiFeedback.Insights
        )).ToList();

    }
}