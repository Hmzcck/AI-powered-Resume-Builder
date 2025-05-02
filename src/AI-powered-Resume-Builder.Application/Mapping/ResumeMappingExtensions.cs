using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;
using AI_powered_Resume_Builder.Application.DTOs;
using AI_powered_Resume_Builder.Domain.Resumes;
using AI_powered_Resume_Builder.Domain.Resumes.Sections;

namespace AI_powered_Resume_Builder.Application.Mapping;

public static class ResumeMappingExtensions
{
    public static ResumeDto ToDto(this Resume resume)
    {
        return new ResumeDto
        {
            Title = resume.Title,
            Score = resume.Score,
            Keywords = resume.Keywords,
            TargetJobDescriptions = resume.TargetJobDescriptions,
            Summary = resume.Summary != null ? new SummaryDto { Content = resume.Summary.Content } : null,
            Experiences = resume.Experiences.Select(e => new ExperienceDto
            {
                Company = e.Company,
                Position = e.Position,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                Description = e.Description,
                Location = e.Location,
                Technologies = e.Technologies,
                Achievements = e.Achievements
            }).ToList(),
            Education = resume.Education.Select(e => new EducationDto
            {
                Institution = e.Institution,
                Degree = e.Degree,
                FieldOfStudy = e.FieldOfStudy,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                Location = e.Location,
                GPA = e.GPA,
                Description = e.Description
            }).ToList(),
            Skills = resume.Skills.Select(s => new SkillDto
            {
                Name = s.Name,
                Category = s.Category,
                ProficiencyLevel = s.ProficiencyLevel,
                Description = s.Description,
                YearsOfExperience = s.YearsOfExperience
            }).ToList(),
            Projects = resume.Projects.Select(p => new ProjectDto
            {
                Name = p.Name,
                Description = p.Description,
                Technologies = p.Technologies,
                Link = p.Link,
                StartDate = p.StartDate,
                EndDate = p.EndDate
            }).ToList(),
            Certifications = resume.Certifications.Select(c => new CertificationDto
            {
                Name = c.Name,
                IssuingOrganization = c.IssuingOrganization,
                IssueDate = c.IssueDate,
                ExpiryDate = c.ExpiryDate,
                CredentialId = c.CredentialId,
                CredentialUrl = c.CredentialUrl
            }).ToList(),
            Languages = resume.Languages.Select(l => new LanguageDto
            {
                Name = l.Name,
                ProficiencyLevel = l.ProficiencyLevel,
                Certification = l.Certification,
                AdditionalInfo = l.AdditionalInfo,
                Speaking = l.Speaking,
                Writing = l.Writing,
                Reading = l.Reading,
                Listening = l.Listening
            }).ToList(),
            Awards = resume.Awards.Select(a => new AwardDto
            {
                Title = a.Title,
                IssuingOrganization = a.IssuingOrganization,
                DateReceived = a.DateReceived,
                Category = a.Category,
                Level = a.Level,
                Url = a.Url,
                Description = a.Description
            }).ToList(),
            Publications = resume.Publications.Select(p => new PublicationDto
            {
                Title = p.Title,
                Authors = p.Authors,
                Publisher = p.Publisher,
                PublicationDate = p.PublicationDate,
                Description = p.Description,
                DOI = p.DOI,
                URL = p.URL,
                Type = p.Type,
                Citation = p.Citation,
                Impact = p.Impact
            }).ToList(),
            References = resume.References.Select(r => new ReferenceDto
            {
                Name = r.Name,
                Position = r.Position,
                Company = r.Company,
                Relationship = r.Relationship,
                Description = r.Description
            }).ToList()
        };
    }

    public static JsonDocument ToJsonDocument(this ResumeDto resumeDto)
    {
        return JsonDocument.Parse(JsonSerializer.Serialize(resumeDto));
    }

    private class AiGeneratedSection
    {
        public string Type { get; set; } = null!;
        public string Header { get; set; } = null!;
        public JsonElement Content { get; set; }
    }

    public static ResumeDto FromJsonDocument(JsonDocument jsonDocument)
    {
        try
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
                WriteIndented = true
            };

            var jsonString = jsonDocument.RootElement.GetRawText();
            Console.WriteLine($"Raw JSON received: {jsonString}");

            // Check if the JSON is an array (AI-generated format)
            if (jsonDocument.RootElement.ValueKind == JsonValueKind.Array)
            {
                var sections = JsonSerializer.Deserialize<List<AiGeneratedSection>>(jsonDocument.RootElement.GetRawText(), options);
                if (sections == null || !sections.Any())
                {
                    throw new InvalidOperationException("No resume sections found in the JSON array");
                }

                var resumeDto = new ResumeDto
                {
                    Title = "Generated Resume",
                    Experiences = new List<ExperienceDto>(),
                    Education = new List<EducationDto>(),
                    Skills = new List<SkillDto>(),
                    Projects = new List<ProjectDto>(),
                    Certifications = new List<CertificationDto>(),
                    Languages = new List<LanguageDto>(),
                    Awards = new List<AwardDto>(),
                    Publications = new List<PublicationDto>(),
                    References = new List<ReferenceDto>()
                };

                foreach (var section in sections)
                {
                    switch (section.Type.ToLower())
                    {
                        case "summary":
                            try
                            {
                                var summaryContent = section.Content.GetString() ?? string.Empty;
                                // Remove HTML tags if present, keeping the text content
                                summaryContent = summaryContent.Replace("<p>", "").Replace("</p>", "\n").Trim();
                                resumeDto.Summary = new SummaryDto 
                                { 
                                    Content = summaryContent
                                };
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"Error parsing summary section: {ex.Message}");
                                resumeDto.Summary = new SummaryDto { Content = string.Empty };
                            }
                            break;

                        case "experience":
                            try 
                            {
                                var aiExperiences = JsonSerializer.Deserialize<JsonElement[]>(section.Content.GetRawText(), options);
                                if (aiExperiences != null && aiExperiences.Length > 0)
                                {
                                    resumeDto.Experiences = aiExperiences.Select(exp => new ExperienceDto
                                    {
                                        Company = exp.GetProperty("companyName").GetString() ?? string.Empty,
                                        Position = exp.GetProperty("jobTitle").GetString() ?? string.Empty,
                                        StartDate = DateTime.Parse(exp.GetProperty("startDate").GetString() ?? DateTime.MinValue.ToString()),
                                        EndDate = string.IsNullOrEmpty(exp.GetProperty("endDate").GetString()) ? null : 
                                                 DateTime.Parse(exp.GetProperty("endDate").GetString()!),
                                        Description = exp.GetProperty("description").GetString()?.Replace("<ul>", "").Replace("</ul>", "").Replace("<li>", "• ").Replace("</li>", "\n").Trim() ?? string.Empty
                                    }).ToList();
                                }
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"Error parsing experience section: {ex.Message}");
                            }
                            break;

                        case "education":
                            try 
                            {
                                var aiEducation = JsonSerializer.Deserialize<JsonElement[]>(section.Content.GetRawText(), options);
                                if (aiEducation != null && aiEducation.Length > 0)
                                {
                                    resumeDto.Education = aiEducation.Select(edu => new EducationDto
                                    {
                                        Institution = edu.GetProperty("schoolName").GetString() ?? string.Empty,
                                        Degree = edu.GetProperty("degree").GetString() ?? string.Empty,
                                        FieldOfStudy = edu.GetProperty("major").GetString() ?? string.Empty,
                                        StartDate = DateTime.Parse(edu.GetProperty("startDate").GetString() ?? DateTime.MinValue.ToString()),
                                        EndDate = string.IsNullOrEmpty(edu.GetProperty("endDate").GetString()) ? null : 
                                                 DateTime.Parse(edu.GetProperty("endDate").GetString()!),
                                        GPA = decimal.TryParse(edu.GetProperty("gpa").GetString(), out var gpa) ? gpa : null,
                                        Description = edu.GetProperty("description").GetString()?.Replace("<p>", "").Replace("</p>", "").Trim() ?? string.Empty
                                    }).ToList();
                                }
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"Error parsing education section: {ex.Message}");
                            }
                            break;

                        case "skills":
                            try
                            {
                                var skillsContent = section.Content.GetString() ?? string.Empty;
                                if (!string.IsNullOrEmpty(skillsContent))
                                {
                                    // Extract skills from the HTML-like content
                                    var skills = new List<SkillDto>();
                                    var lines = skillsContent.Split(new[] { "<p>", "</p>", "<br>", "<br/>" }, StringSplitOptions.RemoveEmptyEntries);
                                    foreach (var line in lines)
                                    {
                                        var colonIndex = line.IndexOf(':');
                                        if (colonIndex > 0)
                                        {
                                            var category = line.Substring(0, colonIndex)
                                                .Replace("<b>", "")
                                                .Replace("</b>", "")
                                                .Replace("<strong>", "")
                                                .Replace("</strong>", "")
                                                .Trim();

                                            var skillsText = line.Substring(colonIndex + 1);
                                            var skillNames = skillsText.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries)
                                                .Select(s => s.Trim())
                                                .Where(s => !string.IsNullOrWhiteSpace(s));
                                            skills.AddRange(skillNames.Select(name => new SkillDto
                                            {
                                                Name = name,
                                                Category = category,
                                                YearsOfExperience = 0
                                            }));
                                        }
                                    }
                                    resumeDto.Skills = skills;
                                }
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"Error parsing skills section: {ex.Message}");
                            }
                            break;

                        case "projects":
                            try
                            {
                                var aiProjects = JsonSerializer.Deserialize<JsonElement[]>(section.Content.GetRawText(), options);
                                if (aiProjects != null && aiProjects.Length > 0)
                                {
                                    resumeDto.Projects = aiProjects.Select(proj => new ProjectDto
                                    {
                                        Name = proj.GetProperty("projectName").GetString() ?? string.Empty,
                                        Description = proj.GetProperty("description").GetString()?.Replace("<p>", "").Replace("</p>", "").Trim() ?? string.Empty,
                                        Technologies = proj.GetProperty("technologies").GetString() ?? string.Empty,
                                        StartDate = DateTime.Parse(proj.GetProperty("startDate").GetString() ?? DateTime.MinValue.ToString()),
                                        EndDate = string.IsNullOrEmpty(proj.GetProperty("endDate").GetString()) ? null :
                                                 DateTime.Parse(proj.GetProperty("endDate").GetString()!)
                                    }).ToList();
                                }
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"Error parsing projects section: {ex.Message}");
                            }
                            break;

                        case "certifications":
                            try
                            {
                                var aiCertifications = JsonSerializer.Deserialize<JsonElement[]>(section.Content.GetRawText(), options);
                                if (aiCertifications != null && aiCertifications.Length > 0)
                                {
                                    resumeDto.Certifications = aiCertifications.Select(cert => new CertificationDto
                                    {
                                        Name = cert.GetProperty("name").GetString() ?? string.Empty,
                                        IssuingOrganization = cert.GetProperty("issuer").GetString() ?? string.Empty,
                                        IssueDate = DateTime.Parse(cert.GetProperty("date").GetString() ?? DateTime.MinValue.ToString()),
                                        CredentialUrl = cert.GetProperty("link").GetString() ?? string.Empty
                                    }).ToList();
                                }
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"Error parsing certifications section: {ex.Message}");
                            }
                            break;

                        case "languages":
                            try
                            {
                                var aiLanguages = JsonSerializer.Deserialize<JsonElement[]>(section.Content.GetRawText(), options);
                                if (aiLanguages != null && aiLanguages.Length > 0)
                                {
                                    resumeDto.Languages = aiLanguages.Select(lang => new LanguageDto
                                    {
                                        Name = lang.GetProperty("name").GetString() ?? string.Empty,
                                        ProficiencyLevel = lang.GetProperty("proficiency").GetString() ?? string.Empty
                                    }).ToList();
                                }
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"Error parsing languages section: {ex.Message}");
                            }
                            break;

                        case "awards":
                            try
                            {
                                var aiAwards = JsonSerializer.Deserialize<JsonElement[]>(section.Content.GetRawText(), options);
                                if (aiAwards != null && aiAwards.Length > 0)
                                {
                                    resumeDto.Awards = aiAwards.Select(award => new AwardDto
                                    {
                                        Title = award.GetProperty("name").GetString() ?? string.Empty,
                                        DateReceived = DateTime.Parse(award.GetProperty("date").GetString() ?? DateTime.MinValue.ToString()),
                                        Description = award.GetProperty("description").GetString()?.Replace("<p>", "").Replace("</p>", "").Trim() ?? string.Empty,
                                        IssuingOrganization = "Not Specified" // Not provided in AI format
                                    }).ToList();
                                }
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"Error parsing awards section: {ex.Message}");
                            }
                            break;

                        case "references":
                            try
                            {
                                if (section.Content.ValueKind == JsonValueKind.Array)
                                {
                                    if (section.Content.GetArrayLength() == 0)
                                    {
                                        resumeDto.References = new List<ReferenceDto>();
                                    }
                                    else
                                    {
                                        var aiReferences = JsonSerializer.Deserialize<JsonElement[]>(section.Content.GetRawText(), options);
                                        if (aiReferences != null)
                                        {
                                            resumeDto.References = aiReferences.Select(reference => new ReferenceDto
                                            {
                                                Name = reference.GetProperty("name").GetString() ?? string.Empty,
                                                Position = reference.GetProperty("position").GetString() ?? string.Empty,
                                                Company = reference.GetProperty("company").GetString() ?? string.Empty,
                                                Relationship = reference.GetProperty("relationship").GetString() ?? string.Empty,
                                                Description = reference.GetProperty("description").GetString()?.Replace("<p>", "").Replace("</p>", "").Trim() ?? string.Empty
                                            }).ToList();
                                        }
                                    }
                                }
                                else if (section.Content.ValueKind == JsonValueKind.String)
                                {
                                    var referencesContent = section.Content.GetString() ?? string.Empty;
                                    if (referencesContent.Contains("Available upon request"))
                                    {
                                        resumeDto.References = new List<ReferenceDto>();
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"Error parsing references section: {ex.Message}");
                                resumeDto.References = new List<ReferenceDto>();
                            }
                            break;

                        case "publications":
                            try
                            {
                                if (section.Content.ValueKind == JsonValueKind.Array)
                                {
                                    if (section.Content.GetArrayLength() == 0)
                                    {
                                        resumeDto.Publications = new List<PublicationDto>();
                                    }
                                    else
                                    {
                                        var aiPublications = JsonSerializer.Deserialize<JsonElement[]>(section.Content.GetRawText(), options);
                                        if (aiPublications != null)
                                        {
                                            resumeDto.Publications = aiPublications.Select(pub => new PublicationDto
                                            {
                                                Title = pub.GetProperty("title").GetString() ?? string.Empty,
                                                Authors = pub.GetProperty("authors").GetString() ?? string.Empty,
                                                Publisher = pub.GetProperty("publisher").GetString() ?? string.Empty,
                                                PublicationDate = DateTime.Parse(pub.GetProperty("publicationDate").GetString() ?? DateTime.MinValue.ToString()),
                                                Description = pub.GetProperty("description").GetString()?.Replace("<p>", "").Replace("</p>", "").Trim() ?? string.Empty,
                                                DOI = pub.GetProperty("doi").GetString() ?? string.Empty,
                                                URL = pub.GetProperty("url").GetString() ?? string.Empty
                                            }).ToList();
                                        }
                                    }
                                }
                                else
                                {
                                    resumeDto.Publications = new List<PublicationDto>();
                                }
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"Error parsing publications section: {ex.Message}");
                                resumeDto.Publications = new List<PublicationDto>();
                            }
                            break;
                    }
                }

                // Set empty collections for any sections that weren't in the AI response
                resumeDto.Experiences ??= new List<ExperienceDto>();
                resumeDto.Education ??= new List<EducationDto>();
                resumeDto.Skills ??= new List<SkillDto>();
                resumeDto.Projects ??= new List<ProjectDto>();
                resumeDto.Certifications ??= new List<CertificationDto>();
                resumeDto.Languages ??= new List<LanguageDto>();
                resumeDto.Awards ??= new List<AwardDto>();
                resumeDto.Publications ??= new List<PublicationDto>();
                resumeDto.References ??= new List<ReferenceDto>();

                return resumeDto;
            }

            // If not an array, try to deserialize directly to ResumeDto
            var result = JsonSerializer.Deserialize<ResumeDto>(jsonDocument, options);
            if (result == null)
            {
                throw new InvalidOperationException("Deserialized result is null");
            }

            // Validate required fields
            if (string.IsNullOrEmpty(result.Title))
            {
                throw new InvalidOperationException("Title is required but was not provided in the JSON");
            }

            return result;
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException($"JSON deserialization error: {ex.Message}. Path: {ex.Path}", ex);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Error deserializing resume JSON document: {ex.Message}", ex);
        }
    }
}
