using AI_powered_Resume_Builder.Application.Resumes.Commands;
using AI_powered_Resume_Builder.Application.Resumes.Queries;
using AI_powered_Resume_Builder.WebApi.Common;
using MediatR;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authorization;

namespace AI_powered_Resume_Builder.WebApi.Controllers;

[Authorize]
public class ResumeController : ApiController
{
    public ResumeController(IMediator mediator) : base(mediator)
    {
    }

    [HttpPost("[action]")]
    public async Task<IActionResult> CreateResume(CreateResumeCommand command)
    {
        CreateResumeCommandResponse response = await _mediator.Send(command);
        return Ok(response);
    }

    [HttpPut("[action]")]
    public async Task<IActionResult> UpdateResume([FromBody] UpdateResumeCommmand command)
    {
        UpdateResumeCommandResponse response = await _mediator.Send(command);
        return Ok(response);
    }

    [HttpDelete("[action]/{id:guid}")]
    public async Task<IActionResult> DeleteResume([FromRoute] Guid id)
    {
        DeleteResumeCommand command = new DeleteResumeCommand(id);
        DeleteResumeCommandResponse response = await _mediator.Send(command);
        return Ok(response);
    }

    [HttpGet("[action]")]
    public async Task<IActionResult> GetAllResumes()
    {
        List<GetAllResumesQueryResponse> response = await _mediator.Send(new GetAllResumesQuery());
        return Ok(response);
    }

    [HttpGet("[action]/{id:guid}")]
    public async Task<IActionResult> GetResumeById([FromRoute] Guid id)
    {
        GetResumeByIdQueryResponse response = await _mediator.Send(new GetResumeByIdQuery(id));
        return Ok(response);
    }
}
