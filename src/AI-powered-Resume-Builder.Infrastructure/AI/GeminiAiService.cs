using System;
using System.Net.Http.Json;
using AI_powered_Resume_Builder.Application.Services;
using AI_powered_Resume_Builder.Infrastructure.DTOs;

namespace AI_powered_Resume_Builder.Infrastructure.AI;

public sealed class GeminiService(HttpClient _httpClient,
GeminiSettings _settings) : IAiService
{
    public async Task<string> GenerateTextAsync(string SystemInstruction,string prompt, CancellationToken cancellationToken)
    {
        var requestBody = new { contents = new[] { new { parts = new[] { new { text =" Prompt: "+prompt } } } },
            systemInstruction = new { parts = new[] { new { text = SystemInstruction } } } };
        
        var response = await _httpClient.PostAsJsonAsync(
            $"/v1beta/models/{_settings.ModelName}:generateContent?key={_settings.ApiKey}",
            requestBody
        );

        response.EnsureSuccessStatusCode();
        var responseData = await response.Content.ReadFromJsonAsync<GeminiResponse>();
        return responseData?.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.Text 
            ?? throw new InvalidOperationException("Failed to parse Gemini response");
    }
}