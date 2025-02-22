using System;
using System.Text.Json;
using AI_powered_Resume_Builder.Domain.AiFeedbacks;
using AI_powered_Resume_Builder.Domain.Common;
using AI_powered_Resume_Builder.Domain.Users;

namespace AI_powered_Resume_Builder.Domain.Resumes;

public class Resume : BaseEntity
{
    public Resume()
    {
        Keywords = new List<string>();
        TargetJobDescriptions = new List<string>();
    }

    public required string Title { get; set; }
    public required JsonDocument Content { get; set; }
    public float? Score { get; set; }
    public List<string> Keywords { get; set; }
    public List<string> TargetJobDescriptions { get; set; }

    // 1-1 relationship
    public AIFeedback? AIFeedback { get; set; }

    // 1-N relationship
    public required Guid ApplicationUserId { get; set; }
    public ApplicationUser ApplicationUser { get; set; } = null!;
}