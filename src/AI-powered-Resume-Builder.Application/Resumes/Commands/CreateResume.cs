using System;
using System.Text.Json;
using AI_powered_Resume_Builder.Application.Services;
using AI_powered_Resume_Builder.Domain.Resumes;
using MediatR;

namespace AI_powered_Resume_Builder.Application.Resumes.Commands;

public sealed record CreateResumeCommand(
    string Title, 
    JsonDocument Content, 
    float? Score, 
    List<string> Keywords,
    List<string>? TargetJobDescriptions
) : IRequest<CreateResumeCommandResponse>;

public sealed record CreateResumeCommandResponse{
    public Guid Id { get; init; }
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
            Keywords = request.Keywords,
            TargetJobDescriptions = request.TargetJobDescriptions,
            ApplicationUserId = currentUserService.UserId
        };

        await resumeRepository.CreateAsync(resume);
        return new CreateResumeCommandResponse{Id = resume.Id};
    }
}