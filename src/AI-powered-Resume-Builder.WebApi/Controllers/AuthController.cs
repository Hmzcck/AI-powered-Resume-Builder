using System;
using AI_powered_Resume_Builder.Application.Auth.Commands;
using AI_powered_Resume_Builder.Application.Users.Queries;
using AI_powered_Resume_Builder.WebApi.Common;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AI_powered_Resume_Builder.WebApi.Controllers;

public class AuthController : ApiController
{
    public AuthController(IMediator mediator) : base(mediator)
    {
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command)
    {
        RegisterCommandResponse registerCommandResponse = await _mediator.Send(command);
        return Ok(registerCommandResponse);
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        LoginCommandResponse loginCommandResponse = await _mediator.Send(command);
        return Ok(loginCommandResponse);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetAllUsersQuery());
        return Ok(result);
    }
}