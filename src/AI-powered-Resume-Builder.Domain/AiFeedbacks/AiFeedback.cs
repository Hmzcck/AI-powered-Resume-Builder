using System.Text.Json;
using AI_powered_Resume_Builder.Domain.Common;
using AI_powered_Resume_Builder.Domain.Resumes;

namespace AI_powered_Resume_Builder.Domain.AiFeedbacks;


public class AiFeedback : BaseEntity
{
    public JsonDocument Improvements { get; set; } = default!;
    public List<string> MissingKeywords { get; set; } = default!;
    public string Insights { get; set; } = default!;


    // 1-1 relationship
    public Guid ResumeId { get; set; }
    public Resume Resume { get; set; } = null!;
}