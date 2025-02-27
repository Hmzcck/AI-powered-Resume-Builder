namespace AI_powered_Resume_Builder.Infrastructure.DTOs;


public sealed record GeminiRequest
(
     List<Content> Contents,
     Content? SystemInstruction
);

public sealed record Content
(
     string Role,
     List<Part> Parts
);

public sealed record Part
(
     string Text
);