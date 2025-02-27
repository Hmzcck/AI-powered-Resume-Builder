using System;

namespace AI_powered_Resume_Builder.Infrastructure.DTOs;

public sealed record GeminiResponse
(
     List<Candidate> Candidates
);

public sealed record Candidate
(
     string Role,
     Content Content
);