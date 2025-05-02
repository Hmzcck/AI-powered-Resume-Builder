using AI_powered_Resume_Builder.Domain.Common;

namespace AI_powered_Resume_Builder.Domain.Resumes.Sections;

public abstract class ResumeSection : BaseEntity
{
    public required Guid ResumeId { get; set; }
    public Resume Resume { get; set; } = null!;
    public required int OrderIndex { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
