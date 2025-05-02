namespace AI_powered_Resume_Builder.Domain.Resumes.Sections;

public class Certification : ResumeSection
{
    public required string Name { get; set; }
    public required string IssuingOrganization { get; set; }
    public required DateTime IssueDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public string? CredentialId { get; set; }
    public string? CredentialUrl { get; set; }
    public string? Description { get; set; }
}
