import type {
  ExperienceDto,
  EducationDto,
  SkillDto,
  ProjectDto,
  CertificationDto,
  LanguageDto,
  AwardDto,
  PublicationDto,
  ReferenceDto,
} from './models';

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

interface BaseSection {
  id: string;
  header: string;
  isLoading?: boolean;
}

interface PersonalSection extends BaseSection {
  type: "personal";
  content: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    website?: string;
  } | string;
}

interface SummarySection extends BaseSection {
  type: "summary";
  content: string;
}

interface ExperienceSection extends BaseSection {
  type: "experience";
  content: ExperienceDto[] | string;
}

interface EducationSection extends BaseSection {
  type: "education";
  content: EducationDto[] | string;
}

interface SkillsSection extends BaseSection {
  type: "skills";
  content: SkillDto[] | string;
}

interface ProjectsSection extends BaseSection {
  type: "projects";
  content: ProjectDto[] | string;
}

interface CertificationsSection extends BaseSection {
  type: "certifications";
  content: CertificationDto[] | string;
}

interface LanguagesSection extends BaseSection {
  type: "languages";
  content: LanguageDto[] | string;
}

interface AwardsSection extends BaseSection {
  type: "awards";
  content: AwardDto[] | string;
}

interface ReferencesSection extends BaseSection {
  type: "references";
  content: ReferenceDto[] | string;
}

interface PublicationsSection extends BaseSection {
  type: "publications";
  content: PublicationDto[] | string;
}

export type Section =
  | PersonalSection
  | SummarySection
  | ExperienceSection
  | EducationSection
  | SkillsSection
  | ProjectsSection
  | CertificationsSection
  | LanguagesSection
  | AwardsSection
  | ReferencesSection
  | PublicationsSection;
