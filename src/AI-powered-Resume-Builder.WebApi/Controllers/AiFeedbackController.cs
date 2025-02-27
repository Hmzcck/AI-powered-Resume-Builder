using System;
using AI_powered_Resume_Builder.Application.AiFeedbacks.Commands;
using AI_powered_Resume_Builder.Application.AiFeedbacks.Queries;
using AI_powered_Resume_Builder.WebApi.Common;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AI_powered_Resume_Builder.WebApi.Controllers;

public class AiFeedbackController : ApiController
{
    public AiFeedbackController(IMediator mediator) : base(mediator)
    {
    }

    [HttpPost("[action]")]
    public async Task<IActionResult> CreateAiFeedback(CreateAiFeedbackCommand command)
    {
        CreateAiFeedbackCommandResponse response = await _mediator.Send(command);
        return Ok(response);
    }

    [HttpPut("[action]")]
    public async Task<IActionResult> UpdateAiFeedback([FromBody] UpdateAiFeedbackCommand command)
    {
        UpdateAiFeedbackCommandResponse response = await _mediator.Send(command);
        return Ok(response);
    }

    [HttpDelete("[action]/{id:guid}")]
    public async Task<IActionResult> DeleteAiFeedback([FromRoute] Guid id)
    {
        DeleteAiFeedbackCommand command = new DeleteAiFeedbackCommand(id);
        DeleteAiFeedbackCommandResponse response = await _mediator.Send(command);
        return Ok(response);
    }

    [HttpGet("[action]/{id:guid}")]
    public async Task<IActionResult> GetAiFeedbackById([FromRoute] Guid id)
    {
        GetAiFeedbackByIdResponse response = await _mediator.Send(new GetAiFeedbackById(id));
        return Ok(response);
    }

    [HttpGet("[action]")]
    public async Task<IActionResult> GetAllAiFeedbacks()
    {
        List<GetAllAiFeedbacksResponse> response = await _mediator.Send(new GetAllAiFeedbacks());
        return Ok(response);
    }
}