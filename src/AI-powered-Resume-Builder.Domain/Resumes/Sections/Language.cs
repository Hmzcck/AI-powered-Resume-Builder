namespace AI_powered_Resume_Builder.Domain.Resumes.Sections;

public class Language : ResumeSection
{
    public required string Name { get; set; }
    public required string ProficiencyLevel { get; set; } // e.g., "Native", "Fluent", "Intermediate", "Basic"
    public string? Certification { get; set; } // e.g., TOEFL, IELTS, etc.
    public string? AdditionalInfo { get; set; }
    
    // Optional detailed proficiency scores
    public int? Speaking { get; set; }
    public int? Writing { get; set; }
    public int? Reading { get; set; }
    public int? Listening { get; set; }
}
