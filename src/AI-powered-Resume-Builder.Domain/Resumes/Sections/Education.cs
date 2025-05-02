namespace AI_powered_Resume_Builder.Domain.Resumes.Sections;

public class Education : ResumeSection
{
    public required string Institution { get; set; }
    public required string Degree { get; set; }
    public required string FieldOfStudy { get; set; }
    public required DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Location { get; set; }
    public decimal? GPA { get; set; }
    public string? Description { get; set; }
    public string? Achievements { get; set; }
}
