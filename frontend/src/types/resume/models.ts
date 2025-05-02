export type SectionType = 
    | "personal"
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "projects"
    | "certifications"
    | "languages"
    | "awards"
    | "references"
    | "publications";

export interface ResumeSection<T = unknown> {
    id: string;
    type: SectionType;
    header: string;
    content: T;
    isLoading?: boolean;
}

export interface PersonalSection extends ResumeSection<{
    fullName: string;
    email: string;
    phone: string;
    location: string;
}> {
    type: "personal";
}

export interface SummarySection extends ResumeSection<{
    text: string;
}> {
    type: "summary";
}

export interface ExperienceSection extends ResumeSection<ExperienceDto[]> {
    type: "experience";
}

export interface EducationSection extends ResumeSection<EducationDto[]> {
    type: "education";
}

export interface SkillsSection extends ResumeSection<{
    category: string;
    skills: SkillDto[];
}[]> {
    type: "skills";
}

export interface ProjectsSection extends ResumeSection<ProjectDto[]> {
    type: "projects";
}

export interface CertificationsSection extends ResumeSection<CertificationDto[]> {
    type: "certifications";
}

export interface LanguagesSection extends ResumeSection<LanguageDto[]> {
    type: "languages";
}

export interface AwardsSection extends ResumeSection<AwardDto[]> {
    type: "awards";
}

export interface ReferencesSection extends ResumeSection<ReferenceDto[]> {
    type: "references";
}

export interface PublicationsSection extends ResumeSection<PublicationDto[]> {
    type: "publications";
}

export interface ResumeDto {
    title: string;
    score?: number;
    keywords?: string[];
    targetJobDescriptions?: string[];
    summary?: SummaryDto;
    experiences: ExperienceDto[];
    education: EducationDto[];
    skills: SkillDto[];
    projects: ProjectDto[];
    certifications: CertificationDto[];
    languages: LanguageDto[];
    awards: AwardDto[];
    publications: PublicationDto[];
    references: ReferenceDto[];
}

export interface AiFeedbackDto {
    improvements: {
        [sectionName: string]: {
            currentContent: string;
            suggestedImprovements: string[];
            reasoning: string;
        };
    };
    missingKeywords: string[];
    insights: string;
}

export interface SummaryDto {
    content: string;
}

export interface ExperienceDto {
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    description: string;
    location?: string;
    technologies?: string;
    achievements?: string;
}

export interface EducationDto {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date;
    endDate?: Date;
    location?: string;
    gpa?: number;
    description?: string;
    achievements?: string;
}

export interface SkillDto {
    name: string;
    category: string;
    proficiencyLevel?: number;
    description?: string;
    yearsOfExperience: number;
}

export interface ProjectDto {
    name: string;
    description: string;
    technologies?: string;
    link?: string;
    startDate?: Date;
    endDate?: Date;
}

export interface CertificationDto {
    name: string;
    issuingOrganization: string;
    issueDate?: Date;
    expiryDate?: Date;
    credentialId?: string;
    credentialUrl?: string;
}

export interface LanguageDto {
    name: string;
    proficiencyLevel: string;
    certification?: string;
    additionalInfo?: string;
    speaking?: number;
    writing?: number;
    reading?: number;
    listening?: number;
}

export interface AwardDto {
    title: string;
    issuingOrganization: string;
    dateReceived: Date;
    description?: string;
    category?: string;
    level?: string;
    url?: string;
}

export interface PublicationDto {
    title: string;
    authors?: string;
    publisher?: string;
    publicationDate: Date;
    description?: string;
    doi?: string;
    url?: string;
    type?: string;
    citation?: string;
    impact?: string;
}

export interface ReferenceDto {
    name: string;
    position: string;
    company: string;
    relationship?: string;
    description?: string;
}
