using System;

namespace AI_powered_Resume_Builder.Infrastructure.Resumes;

public class SystemInstructions
{
    public string SampleResumeContent { get; init; } = default!;
    public string InitialInstructuion { get; init; } = default!;
    public string BuildingResumeTask { get; init; } = default!;
    public string BuildingResumeSectionTask { get; init; } = default!;
    public string BuildingResumeFromJobDescriptionsTask { get; init; } = default!;
    public string GenerateResumeFeedbackTask { get; init; } = default!;
    public string CalculateResumeScoreTask { get; init; } = default!;

    public string GetFullBuildingResumeTask()
    {
        return InitialInstructuion + SampleResumeContent + BuildingResumeTask;
    }

    public string GetFullBuildingResumeSectionTask()
    {
        return InitialInstructuion + SampleResumeContent + BuildingResumeSectionTask;
    }

    public string GetFullBuildingResumeFromJobDescriptionsTask()
    {
        return InitialInstructuion + SampleResumeContent + BuildingResumeFromJobDescriptionsTask;
    }

    public string GetFullGenerateResumeFeedbackTask()
    {
        return InitialInstructuion + SampleResumeContent + GenerateResumeFeedbackTask;
    }

    public string GetFullCalculateResumeScoreTask()
    {
        return InitialInstructuion + SampleResumeContent + CalculateResumeScoreTask;
    }
}
