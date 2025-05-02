namespace AI_powered_Resume_Builder.Domain.Resumes.Sections;

public class Reference : ResumeSection
{
    public required string Name { get; set; }
    public required string Company { get; set; }
    public required string Position { get; set; }
    public string? Relationship { get; set; }
    public string? Description { get; set; }
    // Contact information intentionally omitted for privacy
    // These should be stored separately and securely if needed
}
