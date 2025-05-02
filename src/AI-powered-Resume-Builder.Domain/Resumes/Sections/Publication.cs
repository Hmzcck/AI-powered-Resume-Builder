namespace AI_powered_Resume_Builder.Domain.Resumes.Sections;

public class Publication : ResumeSection
{
    public required string Title { get; set; }
    public required string Publisher { get; set; }
    public required DateTime PublicationDate { get; set; }
    public string? Authors { get; set; }
    public string? Description { get; set; }
    public string? DOI { get; set; }
    public string? URL { get; set; }
    public string? Type { get; set; } // e.g., "Journal Article", "Conference Paper", "Book Chapter"
    public string? Citation { get; set; }
    public string? Impact { get; set; } // e.g., Impact factor, citations count
}
