using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AI_powered_Resume_Builder.WebApi.Common;

[ApiController]
[Route("api/[controller]")]
public abstract class ApiController : ControllerBase
{
    protected readonly IMediator _mediator;

    protected ApiController(IMediator mediator)
    {
        _mediator = mediator;
    }
}