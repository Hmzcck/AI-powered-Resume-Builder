using System.Text.Json;

namespace AI_powered_Resume_Builder.Application.DTOs;

public sealed record class AiFeedbackDto
(
    JsonDocument Improvements,
    List<string> MissingKeywords,
    string Insights
);
