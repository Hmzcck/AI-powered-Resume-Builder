using AI_powered_Resume_Builder.Domain.AiFeedbacks;
using MediatR;

namespace AI_powered_Resume_Builder.Application.AiFeedbacks.Commands;

public sealed record DeleteAiFeedbackCommand(Guid Id) : IRequest<DeleteAiFeedbackCommandResponse>;

public sealed record DeleteAiFeedbackCommandResponse(Unit Unit);

internal sealed class DeleteAiFeedbackCommandHandler(IAiFeedbackRepository aiFeedbackRepository) : IRequestHandler<DeleteAiFeedbackCommand, DeleteAiFeedbackCommandResponse>
{
    public async Task<DeleteAiFeedbackCommandResponse> Handle(DeleteAiFeedbackCommand request, CancellationToken cancellationToken)
    {
        var aiFeedback = await aiFeedbackRepository.GetByIdAsync(request.Id);

        if (aiFeedback == null)
        {
            throw new Exception("AiFeedback not found");
        }

        await aiFeedbackRepository.DeleteAsync(aiFeedback);

        return new DeleteAiFeedbackCommandResponse(Unit.Value);
    }
}