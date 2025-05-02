namespace AI_powered_Resume_Builder.Infrastructure.Resumes;

public class SystemInstructions
{
    private const string SampleResumeJson = @"{
        ""summary"": {
            ""content"": ""Experienced software engineer with expertise in full-stack development...""
        },
        ""experience"": [
            {
                ""company"": ""Tech Corp"",
                ""position"": ""Senior Software Engineer"",
                ""startDate"": ""2020-01-01"",
                ""endDate"": ""2023-12-31"",
                ""description"": ""Led development of cloud-based applications..."",
                ""location"": ""San Francisco, CA"",
                ""technologies"": ""C#, .NET Core, Azure, React"",
                ""achievements"": ""Reduced system latency by 40%""
            }
        ],
        ""education"": [
            {
                ""institution"": ""University of Technology"",
                ""degree"": ""Bachelor of Science"",
                ""fieldOfStudy"": ""Computer Science"",
                ""startDate"": ""2016-09-01"",
                ""endDate"": ""2020-06-30"",
                ""location"": ""Boston, MA"",
                ""gpa"": 3.8,
                ""achievements"": ""Dean's List all semesters""
            }
        ],
        ""skills"": [
            {
                ""name"": ""React"",
                ""category"": ""Frontend"",
                ""proficiencyLevel"": 4,
                ""yearsOfExperience"": 3
            }
        ],
        ""projects"": [
            {
                ""name"": ""E-commerce Platform"",
                ""description"": ""Built a scalable e-commerce solution..."",
                ""startDate"": ""2022-01-01"",
                ""endDate"": ""2022-06-30"",
                ""technologies"": ""React, Node.js, MongoDB"",
                ""link"": ""https://github.com/example/project"",
                ""achievements"": ""100,000+ active users""
            }
        ],
        ""certifications"": [
            {
                ""name"": ""AWS Solutions Architect"",
                ""issuingOrganization"": ""Amazon Web Services"",
                ""issueDate"": ""2022-01-01"",
                ""expiryDate"": ""2025-01-01"",
                ""credentialId"": ""AWS-123-456"",
                ""credentialUrl"": ""https://verify.aws.com/123-456""
            }
        ],
        ""languages"": [
            {
                ""name"": ""English"",
                ""proficiencyLevel"": ""Native"",
                ""certification"": ""IELTS 8.5"",
                ""speaking"": 5,
                ""writing"": 5,
                ""reading"": 5,
                ""listening"": 5
            }
        ],
        ""awards"": [
            {
                ""title"": ""Best Innovation Award"",
                ""issuingOrganization"": ""Tech Conference 2023"",
                ""dateReceived"": ""2023-06-15"",
                ""description"": ""Awarded for innovative use of AI in software"",
                ""category"": ""Professional"",
                ""level"": ""International""
            }
        ],
        ""publications"": [
            {
                ""title"": ""Modern Software Architecture"",
                ""publisher"": ""Tech Journal"",
                ""publicationDate"": ""2023-03-15"",
                ""authors"": ""John Doe, Jane Smith"",
                ""doi"": ""10.1234/example"",
                ""type"": ""Journal Article"",
                ""citation"": ""Doe, J., & Smith, J. (2023). Modern Software Architecture...""
            }
        ],
        ""references"": [
            {
                ""name"": ""Jane Doe"",
                ""company"": ""Tech Solutions Inc"",
                ""position"": ""CTO"",
                ""relationship"": ""Former Manager""
            }
        ]
    }";

    private const string InitialInstructions = @"You are a professional resume writer with expertise in creating effective resumes across various industries. 
Your task is to generate resume content in JSON format that follows a specific structure with separate sections.
Each section should contain detailed, professionally written content that highlights the individual's strengths and achievements.
Use action verbs, quantifiable achievements, and industry-specific terminology where appropriate.

The resume sections should follow this structure:
- summary: A brief professional summary
- experience: Work history with detailed responsibilities and achievements
- education: Academic qualifications
- skills: Technical and professional skills with proficiency levels
- projects: Significant projects with details and outcomes
- certifications: Professional certifications and licenses
- languages: Language proficiencies
- awards: Professional and academic achievements
- publications: Published works or research
- references: Professional references (optional)

Important formatting rules:
1. Use proper date formatting (YYYY-MM-DD)
2. Ensure all required fields are present
3. Use proper casing and punctuation
4. Keep descriptions concise but impactful
5. Include quantifiable achievements where possible

Sample format:
";

    public string SampleResumeContent { get; init; } = SampleResumeJson;
    public string InitialInstruction { get; init; } = InitialInstructions;

    public string BuildingResumeTask { get; init; } = @"
Using the provided prompt, generate a complete resume in JSON format following the structure shown in the sample.
Ensure all sections are properly formatted and contain relevant, professional content.
The response should be valid JSON that can be parsed into corresponding section objects.";

    public string BuildingResumeSectionTask { get; init; } = @"
Generate content for the specified section of the resume, maintaining consistency with any existing content.
The response should be a JSON object containing just the requested section's content.
Ensure the content follows the proper structure for that section type.";

    public string BuildingResumeFromJobDescriptionsTask { get; init; } = @"
Analyze the provided job descriptions and current resume content to generate an optimized version of the resume.
Highlight relevant skills and experiences that match the job requirements.
If UseCurrentResumeInfo is true, maintain the factual information while improving the presentation.
If UseCurrentResumeInfo is false, generate new content based on the job descriptions while maintaining a realistic profile.
Return the complete resume in the proper JSON format with all sections.";

    public string GenerateResumeFeedbackTask { get; init; } = @"
Analyze the provided resume content and provide feedback in the following JSON format:
{
    ""improvements"": {
        ""summary"": [""improvement suggestions...""],
        ""experience"": [""improvement suggestions...""],
        // ... other sections
    },
    ""missingKeywords"": [""important missing keywords""],
    ""insights"": ""overall analysis and recommendations""
}";

    public string CalculateResumeScoreTask { get; init; } = @"
Evaluate the resume content and provide a score between 0-100 based on:
- Professional presentation and formatting
- Content quality and relevance
- Use of action verbs and quantifiable achievements
- Skills alignment with industry standards
- Overall completeness and effectiveness
Return only the numeric score.";

    public string GetFullBuildingResumeTask()
    {
        return InitialInstruction + SampleResumeContent + BuildingResumeTask;
    }

    public string GetFullBuildingResumeSectionTask()
    {
        return InitialInstruction + SampleResumeContent + BuildingResumeSectionTask;
    }

    public string GetFullBuildingResumeFromJobDescriptionsTask()
    {
        return InitialInstruction + SampleResumeContent + BuildingResumeFromJobDescriptionsTask;
    }

    public string GetFullCalculateResumeScoreTask()
    {
        return InitialInstruction + SampleResumeContent + CalculateResumeScoreTask;
    }

    public string GetFullGenerateResumeFeedbackTask()
    {
        return InitialInstruction + SampleResumeContent + GenerateResumeFeedbackTask;
    }
}
