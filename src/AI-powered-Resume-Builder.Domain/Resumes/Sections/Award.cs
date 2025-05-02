namespace AI_powered_Resume_Builder.Domain.Resumes.Sections;

public class Award : ResumeSection
{
    public required string Title { get; set; }
    public required string IssuingOrganization { get; set; }
    public required DateTime DateReceived { get; set; }
    public string? Description { get; set; }
    public string? Category { get; set; } // e.g., "Academic", "Professional", "Leadership"
    public string? Level { get; set; } // e.g., "International", "National", "Regional"
    public string? Url { get; set; }
}
