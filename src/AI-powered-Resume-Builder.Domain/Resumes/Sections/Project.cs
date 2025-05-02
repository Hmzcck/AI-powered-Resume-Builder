namespace AI_powered_Resume_Builder.Domain.Resumes.Sections;

public class Project : ResumeSection
{
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Role { get; set; }
    public string? Technologies { get; set; }
    public string? Link { get; set; }
    public string? Achievements { get; set; }
    public bool IsOngoing { get; set; }
}
