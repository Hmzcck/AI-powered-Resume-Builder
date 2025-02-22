
using System.Text.Json;
using AI_powered_Resume_Builder.Domain.AiFeedbacks;
using MediatR;

namespace AI_powered_Resume_Builder.Application.AiFeedbacks.Queries;

public sealed record GetAiFeedbackById(Guid Id) : IRequest<GetAiFeedbackByIdResponse>;

public sealed record GetAiFeedbackByIdResponse(
    Guid Id,
    Guid ResumeId,
    JsonDocument Improvements,
    List<string> MissingKeywords,
    string Insights
);

internal sealed class GetAiFeedbackByIdHandler(IAiFeedbackRepository aiFeedbackRepository) : IRequestHandler<GetAiFeedbackById, GetAiFeedbackByIdResponse>
{
    public async Task<GetAiFeedbackByIdResponse> Handle(GetAiFeedbackById request, CancellationToken cancellationToken)
    {
        var aiFeedback = await aiFeedbackRepository.GetByIdAsync(request.Id);

        if (aiFeedback == null)
        {
            throw new Exception("AiFeedback not found");
        }

        return new GetAiFeedbackByIdResponse(
            aiFeedback.Id,
            aiFeedback.ResumeId,
            aiFeedback.Improvements,
            aiFeedback.MissingKeywords,
            aiFeedback.Insights
        );
    }
}