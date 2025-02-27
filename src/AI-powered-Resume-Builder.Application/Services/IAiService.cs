namespace AI_powered_Resume_Builder.Application.Services;

public interface IAiService
{
    Task<string> GenerateTextAsync(string SystemInstruction, string prompt, CancellationToken cancellationToken);
}