namespace AI_powered_Resume_Builder.Domain.Resumes.Sections;

public class Skill : ResumeSection
{
    public required string Name { get; set; }
    public required string Category { get; set; }
    public int? ProficiencyLevel { get; set; } // 1-5 scale
    public string? Description { get; set; }
    public int YearsOfExperience { get; set; }
}
