using AI_powered_Resume_Builder.Domain.AiFeedbacks;
using AI_powered_Resume_Builder.Domain.Common;
using AI_powered_Resume_Builder.Domain.Resumes.Sections;
using AI_powered_Resume_Builder.Domain.Users;

namespace AI_powered_Resume_Builder.Domain.Resumes;

public class Resume : BaseEntity
{
    public required string Title { get; set; }
    public float? Score { get; set; }
    public List<string>? Keywords { get; set; }
    public List<string>? TargetJobDescriptions { get; set; }

    // Resume Sections
    public Summary? Summary { get; set; }
    public ICollection<Experience> Experiences { get; set; } = new List<Experience>();
    public ICollection<Education> Education { get; set; } = new List<Education>();
    public ICollection<Skill> Skills { get; set; } = new List<Skill>();
    public ICollection<Project> Projects { get; set; } = new List<Project>();
    public ICollection<Certification> Certifications { get; set; } = new List<Certification>();
    public ICollection<Language> Languages { get; set; } = new List<Language>();
    public ICollection<Award> Awards { get; set; } = new List<Award>();
    public ICollection<Publication> Publications { get; set; } = new List<Publication>();
    public ICollection<Reference> References { get; set; } = new List<Reference>();

    // Relationships
    public AiFeedback? AiFeedback { get; set; }
    public required Guid ApplicationUserId { get; set; }
    public ApplicationUser ApplicationUser { get; set; } = null!;
}
