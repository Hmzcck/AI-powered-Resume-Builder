using System;
using System.Text.Json;
using AI_powered_Resume_Builder.Application.Services;
using AI_powered_Resume_Builder.Domain.Resumes;
using FluentValidation;
using MediatR;

namespace AI_powered_Resume_Builder.Application.Resumes.Commands;

public sealed record CreateResumeCommand(
    string Title, 
    JsonDocument Content, 
    float? Score, 
    List<string>? Keywords,
    List<string>? TargetJobDescriptions
) : IRequest<CreateResumeCommandResponse>;

public sealed record CreateResumeCommandResponse{
    public Guid Id { get; init; }
}
public sealed class CreateResumeCommandValidator : AbstractValidator<CreateResumeCommand>
{
    public CreateResumeCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .Length(3, 100)
            .WithMessage("Title must be between 3 and 100 characters");

        RuleFor(x => x.Content)
            .NotNull()
            .WithMessage("Resume content is required");

        RuleFor(x => x.Score)
            .InclusiveBetween(0, 100)
            .When(x => x.Score.HasValue)
            .WithMessage("Score must be between 0 and 100");

        RuleFor(x => x.Keywords)
            .NotNull()
            .WithMessage("Keywords list is required")
            .Must(x => x.All(k => !string.IsNullOrWhiteSpace(k)))
            .WithMessage("Keywords cannot contain empty values");
    }
}

internal sealed class CreateResumeCommandHandler(IResumeRepository resumeRepository, ICurrentUserService currentUserService) : IRequestHandler<CreateResumeCommand, CreateResumeCommandResponse>
{
    public async Task<CreateResumeCommandResponse> Handle(CreateResumeCommand request, CancellationToken cancellationToken)
    {
        if(!currentUserService.IsAuthenticated)
            throw new UnauthorizedAccessException("User is not authenticated");
        
        var existingResume = await resumeRepository.GetByUserIdAsync(currentUserService.UserId);
        if(existingResume != null)
            throw new InvalidOperationException("User already has a resume");

        var resume = new Resume{
            Title = request.Title,
            Content = request.Content,
            Score = request.Score,
            Keywords = request.Keywords ?? [],
            TargetJobDescriptions = request.TargetJobDescriptions ?? [],
            ApplicationUserId = currentUserService.UserId
        };

        await resumeRepository.CreateAsync(resume);
        return new CreateResumeCommandResponse{Id = resume.Id};
    }
}