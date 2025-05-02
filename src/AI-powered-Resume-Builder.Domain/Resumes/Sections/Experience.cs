namespace AI_powered_Resume_Builder.Domain.Resumes.Sections;

public class Experience : ResumeSection
{
    public required string Company { get; set; }
    public required string Position { get; set; }
    public required DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public required string Description { get; set; }
    public string? Location { get; set; }
    public string? Technologies { get; set; }
    public string? Achievements { get; set; }
}
