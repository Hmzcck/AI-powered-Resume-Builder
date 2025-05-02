using System;
using System.Collections.Generic;

namespace AI_powered_Resume_Builder.Application.DTOs;

public class ResumeDto
{
    public string Title { get; set; } = null!;
    public float? Score { get; set; }
    public List<string>? Keywords { get; set; }
    public List<string>? TargetJobDescriptions { get; set; }
    
    // Resume Sections
    public SummaryDto? Summary { get; set; }
    public ICollection<ExperienceDto> Experiences { get; set; } = new List<ExperienceDto>();
    public ICollection<EducationDto> Education { get; set; } = new List<EducationDto>();
    public ICollection<SkillDto> Skills { get; set; } = new List<SkillDto>();
    public ICollection<ProjectDto> Projects { get; set; } = new List<ProjectDto>();
    public ICollection<CertificationDto> Certifications { get; set; } = new List<CertificationDto>();
    public ICollection<LanguageDto> Languages { get; set; } = new List<LanguageDto>();
    public ICollection<AwardDto> Awards { get; set; } = new List<AwardDto>();
    public ICollection<PublicationDto> Publications { get; set; } = new List<PublicationDto>();
    public ICollection<ReferenceDto> References { get; set; } = new List<ReferenceDto>();
}

public class SummaryDto
{
    public string Content { get; set; } = null!;
}

public class ExperienceDto
{
    public string Company { get; set; } = null!;
    public string Position { get; set; } = null!;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Description { get; set; } = null!;
    public string? Location { get; set; }
    public string? Technologies { get; set; }
    public string? Achievements { get; set; }
}

public class EducationDto
{
    public string Institution { get; set; } = null!;
    public string Degree { get; set; } = null!;
    public string FieldOfStudy { get; set; } = null!;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Location { get; set; }
    public decimal? GPA { get; set; }
    public string? Description { get; set; }
    public string? Achievements { get; set; }
}

public class SkillDto
{
    public string Name { get; set; } = null!;
    public string Category { get; set; } = null!;
    public int? ProficiencyLevel { get; set; }
    public string? Description { get; set; }
    public int YearsOfExperience { get; set; }
}

public class ProjectDto
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string? Technologies { get; set; }
    public string? Link { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class CertificationDto
{
    public string Name { get; set; } = null!;
    public string IssuingOrganization { get; set; } = null!;
    public DateTime? IssueDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public string? CredentialId { get; set; }
    public string? CredentialUrl { get; set; }
}

public class LanguageDto
{
    public string Name { get; set; } = null!;
    public string ProficiencyLevel { get; set; } = null!;
    public string? Certification { get; set; }
    public string? AdditionalInfo { get; set; }
    public int? Speaking { get; set; }
    public int? Writing { get; set; }
    public int? Reading { get; set; }
    public int? Listening { get; set; }
}

public class AwardDto
{
    public string Title { get; set; } = null!;
    public string IssuingOrganization { get; set; } = null!;
    public DateTime DateReceived { get; set; }
    public string? Description { get; set; }
    public string? Category { get; set; }
    public string? Level { get; set; }
    public string? Url { get; set; }
}

public class PublicationDto
{
    public string Title { get; set; } = null!;
    public string? Authors { get; set; }
    public string? Publisher { get; set; }
    public DateTime PublicationDate { get; set; }
    public string? Description { get; set; }
    public string? DOI { get; set; }
    public string? URL { get; set; }
    public string? Type { get; set; }
    public string? Citation { get; set; }
    public string? Impact { get; set; }
}

public class ReferenceDto
{
    public string Name { get; set; } = null!;
    public string Position { get; set; } = null!;
    public string Company { get; set; } = null!;
    public string? Relationship { get; set; }
    public string? Description { get; set; }
}
